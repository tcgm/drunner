/**
 * Centralized save management system
 * All save loading flows through here to ensure consistent migration handling
 */

import type { GameState } from '@/types'
import { migrateGameState, needsMigration } from '../utils/migration'
import LZString from 'lz-string'

export interface LoadResult {
  success: boolean
  state?: GameState
  needsMigration: boolean
  error?: string
}

/**
 * Load and validate a save from any source (localStorage, import, backup)
 * Always checks for migration needs and returns appropriate result
 */
export function loadSave(
  compressedData: string,
  source: 'localStorage' | 'import' | 'backup' = 'localStorage'
): LoadResult {
  try {
    console.log(`[SaveManager] Loading save from ${source}`)
    
    // Decompress the data
    let jsonString: string
    try {
      jsonString = LZString.decompressFromUTF16(compressedData) || compressedData
    } catch {
      jsonString = compressedData
    }

    // Parse the JSON
    const parsed = JSON.parse(jsonString)
    
    // Extract state based on structure
    let state: GameState
    if (parsed.state) {
      // Zustand persist format
      state = parsed.state
    } else if (parsed.data) {
      // Export format
      state = parsed.data
    } else {
      // Direct state object
      state = parsed
    }

    // Validate required fields
    const requiredFields = ['party', 'heroRoster', 'dungeon', 'bankGold', 'bankInventory']
    const hasRequiredFields = requiredFields.every(field => field in state)
    
    if (!hasRequiredFields) {
      console.error('[SaveManager] Save missing required fields')
      return {
        success: false,
        needsMigration: false,
        error: 'Invalid save format - missing required fields'
      }
    }

    // Check if migration is needed
    const migrationNeeded = needsMigration(state)
    
    if (migrationNeeded) {
      console.log('[SaveManager] Save requires migration')
      return {
        success: true,
        state,
        needsMigration: true
      }
    }

    // No migration needed - apply migrations that are safe (like hero stats)
    console.log('[SaveManager] Save is current, no migration needed')
    const migratedState = migrateGameState(state)
    
    return {
      success: true,
      state: migratedState,
      needsMigration: false
    }
  } catch (error) {
    console.error('[SaveManager] Failed to load save:', error)
    return {
      success: false,
      needsMigration: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Apply a migrated state (call this after user approves migration)
 */
export function applyMigratedState(state: GameState): GameState {
  console.log('[SaveManager] Applying migration to state')
  return migrateGameState(state)
}

/**
 * Validate save data structure without loading
 */
export function validateSaveData(compressedData: string): { valid: boolean; error?: string } {
  try {
    // Decompress
    let jsonString: string
    try {
      jsonString = LZString.decompressFromUTF16(compressedData) || compressedData
    } catch {
      jsonString = compressedData
    }

    // Parse
    const parsed = JSON.parse(jsonString)
    
    // Check structure
    const state = parsed.state || parsed.data || parsed
    const requiredFields = ['party', 'heroRoster', 'dungeon', 'bankGold', 'bankInventory']
    const hasRequiredFields = requiredFields.every(field => field in state)
    
    if (!hasRequiredFields) {
      return { valid: false, error: 'Missing required fields' }
    }

    return { valid: true }
  } catch (error) {
    return { 
      valid: false, 
      error: error instanceof Error ? error.message : 'Invalid JSON' 
    }
  }
}
