/**
 * IndexedDB storage layer for game saves.
 * Provides a simple key-value store backed by IndexedDB,
 * with one-time migration from localStorage on first load.
 */

const DB_NAME = 'dungeon-runner-db'
const STORE_NAME = 'keyval'
const DB_VERSION = 1

/** Prefix used to identify all game save keys in localStorage during migration */
const LS_PREFIX = 'dungeon-runner-'
/** The key that must exist in localStorage to trigger migration */
const MAIN_SAVE_KEY = 'dungeon-runner-storage'

let _db: IDBDatabase | null = null

function openDB(): Promise<IDBDatabase> {
  if (_db) return Promise.resolve(_db)
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    }
    req.onsuccess = (e) => {
      _db = (e.target as IDBOpenDBRequest).result
      resolve(_db)
    }
    req.onerror = () => reject(req.error)
  })
}

export async function idbGet(key: string): Promise<string | null> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const req = tx.objectStore(STORE_NAME).get(key)
    req.onsuccess = () => resolve(req.result ?? null)
    req.onerror = () => reject(req.error)
  })
}

export async function idbSet(key: string, value: string): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).put(value, key)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function idbRemove(key: string): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).delete(key)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function idbKeys(): Promise<string[]> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const req = tx.objectStore(STORE_NAME).getAllKeys()
    req.onsuccess = () => resolve(req.result as string[])
    req.onerror = () => reject(req.error)
  })
}

/**
 * One-time migration: copies all dungeon-runner-* keys from localStorage to IndexedDB.
 * Called when IDB has no main save but localStorage does (first run after upgrade).
 * localStorage data is left intact as a fallback.
 */
async function migrateFromLocalStorage(): Promise<void> {
  const keysToMigrate = Object.keys(localStorage).filter(k => k.startsWith(LS_PREFIX))
  if (keysToMigrate.length === 0) return
  console.log(`[IDB Migration] Migrating ${keysToMigrate.length} save key(s) from localStorage to IndexedDB...`)
  for (const key of keysToMigrate) {
    const value = localStorage.getItem(key)
    if (value !== null) {
      await idbSet(key, value)
    }
  }
  console.log('[IDB Migration] Complete. localStorage data preserved as read-only fallback.')
}

/**
 * Get a value from IndexedDB, running one-time migration from localStorage if needed.
 * Use this for the initial page-load fetch (Zustand persist getItem).
 */
export async function idbGetWithMigration(key: string): Promise<string | null> {
  const value = await idbGet(key)
  if (value !== null) return value

  // IDB is empty. If localStorage has the main save, migrate everything over.
  if (localStorage.getItem(MAIN_SAVE_KEY) !== null) {
    await migrateFromLocalStorage()
    return idbGet(key)
  }

  return null
}
