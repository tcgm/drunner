/**
 * Save actions module
 * Handles save import/export, backups, and migration approval
 */

import type { StateCreator } from 'zustand'
import type { GameState } from '@/types'
import LZString from 'lz-string'
import { loadSave, applyMigratedState } from '@/core/saveManager'
import { createBackup, listBackups as listBackupsUtil, restoreBackup as restoreBackupUtil } from './backup'
import { saveRunHistory, loadRunHistory } from './runHistory'

export interface SaveActionsSlice {
  listBackups: () => string[]
  createManualBackup: () => boolean
  restoreFromBackup: (backupKey: string) => boolean
  downloadBackup: (backupKey: string) => boolean
  exportSave: () => void
  importSave: (jsonString: string) => boolean
  approveMigration: () => void
  cancelMigration: () => void
}

export const createSaveActions: StateCreator<
  GameState & SaveActionsSlice,
  [],
  [],
  SaveActionsSlice
> = (set, get) => ({
  listBackups: () => {
    return listBackupsUtil('dungeon-runner-storage')
  },

  createManualBackup: () => {
    try {
      const current = localStorage.getItem('dungeon-runner-storage')
      if (current) {
        createBackup('dungeon-runner-storage', true) // Force=true bypasses throttling
        return true
      }
      return false
    } catch (error) {
      console.error('[Backup] Failed to create manual backup:', error)
      return false
    }
  },

  restoreFromBackup: (backupKey: string) => {
    const success = restoreBackupUtil('dungeon-runner-storage', backupKey)
    if (success) {
      // Reload the page to apply restored state
      window.location.reload()
    }
    return success
  },

  downloadBackup: (backupKey: string) => {
    try {
      const compressed = localStorage.getItem(backupKey)
      if (!compressed) {
        console.error('[Backup] Backup not found:', backupKey)
        return false
      }

      // Decompress the backup data
      let str: string
      try {
        str = LZString.decompressFromUTF16(compressed) || compressed
      } catch {
        str = compressed
      }

      // Parse the state
      const state = JSON.parse(str)

      // Format as a save file export
      const saveData = {
        version: 1,
        timestamp: Date.now(),
        backupKey: backupKey,
        data: state.state || state
      }

      // Use custom replacer to strip out icon functions
      const replacer = (key: string, val: unknown) => {
        if (key === 'icon' && typeof val === 'function') {
          return undefined
        }
        return val
      }

      const json = JSON.stringify(saveData, replacer, 2)
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      
      // Extract timestamp from backup key for filename
      const timestamp = backupKey.split('-').pop() || Date.now()
      link.download = `dungeon-runner-backup-${timestamp}.json`
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      return true
    } catch (error) {
      console.error('[Backup] Failed to download backup:', error)
      return false
    }
  },

  exportSave: () => {
    try {
      const state = get()
      const saveData = {
        version: 1,
        timestamp: Date.now(),
        data: state
      }

      // Custom replacer to strip out icon functions
      const replacer = (key: string, val: unknown) => {
        if (key === 'icon' && typeof val === 'function') {
          return undefined
        }
        return val
      }

      const json = JSON.stringify(saveData, replacer, 2)
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `dungeon-runner-save-${Date.now()}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('[Export] Failed to export save:', error)
    }
  },

  importSave: (jsonString: string) => {
    try {
      // Use centralized save loading system
      const result = loadSave(jsonString, 'import')

      if (!result.success) {
        console.error('[Import] Failed to load save:', result.error)
        return false
      }

      if (result.needsMigration && result.state) {
        console.log('[Import] Save needs migration, setting pending state')
        // Store for migration approval
        set({
          pendingMigration: true,
          pendingMigrationData: jsonString
        })
        return true
      }

      // No migration needed - apply directly
      if (result.state) {
        set(result.state)
        console.log('[Import] Save imported successfully')
        return true
      }
      
      return false
    } catch (error) {
      console.error('[Import] Failed to import save:', error)
      return false
    }
  },

  approveMigration: () => {
    const { pendingMigrationData } = get()
    if (!pendingMigrationData) {
      console.error('[Migration] No pending migration data')
      return
    }

    try {
      // Load the pending save using centralized system
      const result = loadSave(pendingMigrationData, 'import')
      
      if (!result.success || !result.state) {
        console.error('[Migration] Failed to load pending migration data')
        set({ pendingMigration: false, pendingMigrationData: null })
        return
      }

      // Apply the migration
      console.log('[Migration] User approved migration, applying changes...')
      const migratedState = applyMigratedState(result.state)
      console.log('[Migration] Migration complete, state will be saved on next update')
      
      // Migrate run history to separate storage if it exists
      if (migratedState.runHistory && migratedState.runHistory.length > 0) {
        console.log(`[RunHistory Migration] Found ${migratedState.runHistory.length} runs in old save, migrating to separate storage`)
        const existingHistory = loadRunHistory()

        // Merge old and new, deduplicate by run ID
        const allRuns = [...migratedState.runHistory, ...existingHistory]
        const uniqueRuns = allRuns.filter((run, index, self) =>
          index === self.findIndex(r => r.id === run.id)
        )

        saveRunHistory(uniqueRuns)
        console.log(`[RunHistory Migration] Saved ${uniqueRuns.length} total runs`)

        // Clear from main state
        migratedState.runHistory = []
      }

      // Apply the migrated state and clear pending flags
      // This will trigger persist middleware to save
      set({ 
        ...migratedState,
        pendingMigration: false,
        pendingMigrationData: null
      })

      console.log('[Migration] Migration applied successfully')
    } catch (error) {
      console.error('[Migration] Failed to apply migration:', error)
      set({ pendingMigration: false, pendingMigrationData: null })
    }
  },

  cancelMigration: () => {
    console.log('[Migration] User cancelled migration')
    set({
      pendingMigration: false,
      pendingMigrationData: null
    })
  },
})
