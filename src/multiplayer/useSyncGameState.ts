/**
 * useSyncGameState — DEPRECATED stub.
 *
 * All sync logic has moved to multiplayerService.ts which is started/stopped
 * directly from multiplayerStore (no React required).
 *
 * This stub is kept so existing import sites compile without changes.
 */
export function useSyncGameState() {
  // no-op: service is started by multiplayerStore on createRoom / joinRoom
}
