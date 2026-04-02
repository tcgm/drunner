/**
 * Run history management module
 * Persists run history in IndexedDB with an in-memory cache so that
 * synchronous Zustand state setters can call loadRunHistory() / saveRunHistory()
 * without awaiting.  IDB writes happen fire-and-forget in the background.
 */

import type { Run } from '@/types'
import LZString from 'lz-string'
import { idbGet, idbSet, idbRemove } from '@/utils/idbStorage'

const RUN_HISTORY_KEY = 'dungeon-runner-run-history'

/** In-memory cache – null means "not yet initialised" */
let _cache: Run[] | null = null

/**
 * Populate the in-memory cache from IndexedDB.
 * Must be awaited once during app startup (called from onRehydrateStorage).
 */
export async function initRunHistoryCache(): Promise<void> {
  try {
    const compressed = await idbGet(RUN_HISTORY_KEY)
    if (!compressed) {
      _cache = []
      return
    }
    const json = LZString.decompressFromUTF16(compressed) || compressed
    _cache = JSON.parse(json) || []
    console.log(`[RunHistory] Cache initialised with ${_cache!.length} runs from IndexedDB`)
  } catch (error) {
    console.error('[RunHistory] Failed to initialise cache:', error)
    _cache = []
  }
}

/**
 * Save run history.  Updates the in-memory cache immediately and persists
 * to IndexedDB asynchronously (fire-and-forget).
 */
export function saveRunHistory(runHistory: Run[]): void {
  _cache = runHistory
  try {
    const json = JSON.stringify(runHistory)
    const compressed = LZString.compressToUTF16(json)
    idbSet(RUN_HISTORY_KEY, compressed).catch(err => {
      console.error('[RunHistory] Failed to persist to IndexedDB:', err)
    })
    console.log(`[RunHistory] Saved ${runHistory.length} runs`)
  } catch (error) {
    console.error('[RunHistory] Failed to save:', error)
  }
}

/**
 * Load run history synchronously from the in-memory cache.
 * Returns an empty array if the cache has not been initialised yet.
 */
export function loadRunHistory(): Run[] {
  return _cache ?? []
}

/**
 * Clear run history from both cache and IndexedDB.
 */
export async function clearRunHistory(): Promise<void> {
  _cache = []
  await idbRemove(RUN_HISTORY_KEY)
  console.log('[RunHistory] Cleared all run history')
}
