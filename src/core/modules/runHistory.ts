/**
 * Run history management module
 * Handles saving and loading run history to/from localStorage
 */

import type { Run } from '@/types'
import LZString from 'lz-string'

/**
 * Save run history to separate localStorage key to keep main save small
 */
export function saveRunHistory(runHistory: Run[]) {
  try {
    const json = JSON.stringify(runHistory)
    const compressed = LZString.compressToUTF16(json)
    localStorage.setItem('dungeon-runner-run-history', compressed)
    console.log(`[RunHistory] Saved ${runHistory.length} runs`)
  } catch (error) {
    console.error('[RunHistory] Failed to save:', error)
  }
}

/**
 * Load run history from separate localStorage key
 */
export function loadRunHistory(): Run[] {
  try {
    const compressed = localStorage.getItem('dungeon-runner-run-history')
    if (!compressed) return []

    const json = LZString.decompressFromUTF16(compressed) || compressed
    return JSON.parse(json) || []
  } catch (error) {
    console.error('[RunHistory] Failed to load:', error)
    return []
  }
}
