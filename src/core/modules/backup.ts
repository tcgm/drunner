/**
 * Backup management module
 * Handles creating, listing, and restoring game state backups
 */

// Backup configuration
export const BACKUP_CONFIG = {
  maxBackups: 10,
  minIntervalMs: 5 * 60 * 1000, // 5 minutes between backups
  storageKey: 'dungeon-runner-last-backup'
}

/**
 * Get the timestamp of the last backup
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
 * Create a backup of the current state
 * Throttled to prevent excessive backups
 */
export function createBackup(name: string, force = false): void {
  try {
    const current = localStorage.getItem(name)
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

      // Check localStorage size before attempting backup
      const currentSize = new Blob([current]).size
      console.log(`[Backup] Current save size: ${(currentSize / 1024).toFixed(2)} KB`)

      // Keep only the configured number of backups
      const backupKeys = Object.keys(localStorage)
        .filter(key => key.startsWith(`${name}-backup-`))
        .sort()

      while (backupKeys.length >= BACKUP_CONFIG.maxBackups) {
        const oldestKey = backupKeys.shift()
        if (oldestKey) {
          localStorage.removeItem(oldestKey)
          console.log(`[Backup] Removed old backup: ${oldestKey}`)
        }
      }

      // Try to create backup
      localStorage.setItem(`${name}-backup-${timestamp}`, current)
      setLastBackupTime(timestamp)
      console.log(`[Backup] Created backup: ${name}-backup-${timestamp}`)
    }
  } catch (error) {
    console.error('[Backup] Failed to create backup:', error)
    // If quota exceeded, delete all backups and try again
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.log('[Backup] Quota exceeded, clearing all backups...')
      const backupKeys = Object.keys(localStorage)
        .filter(key => key.startsWith(`${name}-backup-`))
      backupKeys.forEach(key => localStorage.removeItem(key))
      console.log(`[Backup] Cleared ${backupKeys.length} old backups`)
    }
  }
}

/**
 * List available backups
 */
export function listBackups(name: string): string[] {
  return Object.keys(localStorage)
    .filter(key => key.startsWith(`${name}-backup-`))
    .sort()
    .reverse()
}

/**
 * Restore from a backup
 */
export function restoreBackup(name: string, backupKey: string): boolean {
  try {
    const backup = localStorage.getItem(backupKey)
    if (backup) {
      localStorage.setItem(name, backup)
      console.log(`[Backup] Restored from: ${backupKey}`)
      return true
    }
    return false
  } catch (error) {
    console.error('[Backup] Failed to restore backup:', error)
    return false
  }
}
