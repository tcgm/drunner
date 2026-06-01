/**
 * useDungeonActions – multiplayer-aware dungeon action wrappers.
 *
 * When the local player is the HOST (or not in a multiplayer session), the
 * real Zustand actions are returned directly — except for selectChoice which
 * is replaced by a voting wrapper when in a multiplayer session.
 *
 * When the local player is a GUEST, most action calls are forwarded to the
 * host via Socket.io.
 */

import { useMultiplayerStore } from './multiplayerStore'
import { getSocket } from './socket'
import { useGameStore } from '@/core/gameStore'
import { recordVote } from './voteManager'
import type { EventChoice } from '@/types'
import type { GuestAction } from './types'
import type { DungeonEvent } from '@/types'

function sendGuestAction(code: string, action: GuestAction) {
  getSocket().emit('guest-action', { code, action })
}

export function useDungeonActions() {
  const role = useMultiplayerStore((s) => s.role)
  const roomCode = useMultiplayerStore((s) => s.roomCode)

  const {
    advanceDungeon: storeAdvance,
    selectChoice: storeSelect,
    selectMapNode: storeSelectNode,
    retreatFromDungeon: storeRetreat,
    startDungeon: storeStart,
    dungeon,
  } = useGameStore()

  const isMultiplayer = role !== null && roomCode !== null
  const isGuest = role === 'guest' && roomCode !== null

  // ── selectChoice: voting-aware in multiplayer ──────────────────────────────
  // In single-player: execute immediately.
  // In multiplayer (host): record host's vote via voteManager.
  // In multiplayer (guest): emit 'cast-vote' socket event.
  const selectChoice = isMultiplayer
    ? (choice: EventChoice) => {
        const choices = (dungeon.currentEvent as DungeonEvent | null)?.choices ?? []
        const index = choices.findIndex((c) => c === choice)
        const idx = index >= 0 ? index : 0

        if (isGuest) {
          const socket = getSocket()
          socket.emit('cast-vote', { code: roomCode, choiceIndex: idx })
        } else {
          // Host: record own vote (voteManager handles broadcast + majority check)
          recordVote(getSocket().id ?? 'host', idx)
        }
      }
    : storeSelect

  // ── combatAction: route to host in multiplayer ────────────────────────────
  // Guests emit guest-action; the host stores it in combatQueue.
  // On the host's machine this is called directly by BossCombatScreen.
  const submitCombatAction = isGuest
    ? (heroId: string, action: string) =>
        sendGuestAction(roomCode!, { type: 'combat-action', heroId, action })
    : null  // host calls handleHeroAction directly in BossCombatScreen

  return {
    isGuest,
    isMultiplayer,

    advanceDungeon: isGuest
      ? () => sendGuestAction(roomCode!, { type: 'advance-dungeon' })
      : storeAdvance,

    selectChoice,

    selectMapNode: isGuest
      ? (nodeId: string) => sendGuestAction(roomCode!, { type: 'select-map-node', nodeId })
      : storeSelectNode,

    retreatFromDungeon: isGuest
      ? () => sendGuestAction(roomCode!, { type: 'retreat' })
      : storeRetreat,

    startDungeon: isGuest
      ? (startingFloor?: number, alkahestCost?: number) =>
          sendGuestAction(roomCode!, { type: 'start-dungeon', startingFloor, alkahestCost })
      : storeStart,

    /**
     * Submit a combat action for a hero the local player controls.
     * Null when the local player is the host (they call handleHeroAction directly).
     */
    submitCombatAction,
  }
}
