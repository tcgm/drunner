/**
 * useDungeonActions – multiplayer-aware dungeon action wrappers.
 *
 * When the local player is the HOST (or not in a multiplayer session), the
 * real Zustand actions are returned directly.
 *
 * When the local player is a GUEST, action calls are forwarded to the host
 * via Socket.io instead of executing locally.
 */

import { useMultiplayerStore } from './multiplayerStore'
import { getSocket } from './socket'
import { useGameStore } from '@/core/gameStore'
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

  const isGuest = role === 'guest' && roomCode !== null

  return {
    isGuest,

    advanceDungeon: isGuest
      ? () => sendGuestAction(roomCode!, { type: 'advance-dungeon' })
      : storeAdvance,

    selectChoice: isGuest
      ? (choice: EventChoice) => {
          // Derive the index from the current event since EventChoice has no id
          const choices = (dungeon.currentEvent as DungeonEvent | null)?.choices ?? []
          const index = choices.indexOf(choice)
          sendGuestAction(roomCode!, { type: 'select-choice', choiceIndex: index >= 0 ? index : 0 })
        }
      : storeSelect,

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
  }
}
