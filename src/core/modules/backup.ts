/**
 * Backup management module
 * Handles creating, listing, and restoring game state backups in IndexedDB.
 * The last-backup timestamp is kept in localStorage (tiny value, not game data).
 */

import { idbGet, idbSet, idbRemove, idbKeys } from '@/utils/idbStorage'

// Backup configuration
export const BACKUP_CONFIG = {
  maxBackups: 10,
  minIntervalMs: 5 * 60 * 1000, // 5 minutes between backups
  storageKey: 'dungeon-runner-last-backup'
}

/**
 * Get the timestamp of the last backup (stored in localStorage – tiny value)
 */
export function getLastBackupTime(): number {
  const lastBackup = localStorage.getItem(BACKUP_CONFIG.storageKey)
  return lastBackup ? parseInt(lastBackup) : 0
}

/**
 * Set the timestamp of the last backup
 */
export function setLastBackupTime(timestamp: number): void {
  localStorage.setItem(BACKUP_CONFIG.storageKey, timestamp.toString())
}

/**
 * Create a backup of the current state in IndexedDB.
 * Throttled to prevent excessive backups.
 */
export async function createBackup(name: string, force = false): Promise<void> {
  try {
    const current = await idbGet(name)
    if (current) {
      const timestamp = Date.now()

      // Check throttling (skip if recent backup exists)
      if (!force) {
        const lastBackup = getLastBackupTime()
        const timeSinceLastBackup = timestamp - lastBackup
        if (timeSinceLastBackup < BACKUP_CONFIG.minIntervalMs) {
          console.log(`[Backup] Skipping backup (last backup ${Math.floor(timeSinceLastBackup / 1000)}s ago, minimum ${BACKUP_CONFIG.minIntervalMs / 1000}s)`)
          return
        }
      }

      const currentSize = new Blob([current]).size
      console.log(`[Backup] Current save size: ${(currentSize / 1024).toFixed(2)} KB`)

      // Keep only the configured number of backups
      const allKeys = await idbKeys()
      const backupKeys = allKeys
        .filter(key => key.startsWith(`${name}-backup-`))
        .sort()

      while (backupKeys.length >= BACKUP_CONFIG.maxBackups) {
        const oldestKey = backupKeys.shift()
        if (oldestKey) {
          await idbRemove(oldestKey)
          console.log(`[Backup] Removed old backup: ${oldestKey}`)
        }
      }

      await idbSet(`${name}-backup-${timestamp}`, current)
      setLastBackupTime(timestamp)
      console.log(`[Backup] Created backup: ${name}-backup-${timestamp}`)
    }
  } catch (error) {
    console.error('[Backup] Failed to create backup:', error)
  }
}

/**
 * List available backups (newest first)
 */
export async function listBackups(name: string): Promise<string[]> {
  const allKeys = await idbKeys()
  return allKeys
    .filter(key => key.startsWith(`${name}-backup-`))
    .sort()
    .reverse()
}

/**
 * Restore from a backup
 */
export async function restoreBackup(name: string, backupKey: string): Promise<boolean> {
  try {
    const backup = await idbGet(backupKey)
    if (backup) {
      await idbSet(name, backup)
      console.log(`[Backup] Restored from: ${backupKey}`)
      return true
    }
    return false
  } catch (error) {
    console.error('[Backup] Failed to restore backup:', error)
    return false
  }
}
