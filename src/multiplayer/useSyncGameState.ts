/**
 * useSyncGameState – mounts in App and keeps host/guest state in sync.
 *
 * HOST: subscribes to the Zustand game store and broadcasts the dungeon
 *       slice to all guests whenever it changes.  Also listens for guest
 *       action requests and executes them on the authoritative store.
 *
 * GUEST: listens for state-update messages and calls applyMultiplayerState
 *        to overwrite the local dungeon/party/outcome state.
 */

import { useEffect, useRef } from 'react'
import { useMultiplayerStore } from './multiplayerStore'
import { getSocket } from './socket'
import { useGameStore } from '@/core/gameStore'
import type { MultiplayerSyncState, GuestAction } from './types'

/** Extract only the fields that need to be replicated to guests. */
function extractSync(
  state: ReturnType<typeof useGameStore.getState>,
): MultiplayerSyncState {
  return {
    dungeon: state.dungeon,
    party: state.party,
    isGameOver: state.isGameOver,
    isPaused: state.isPaused,
    lastOutcome: state.lastOutcome,
    activeRun: state.activeRun,
  }
}

export function useSyncGameState() {
  const role = useMultiplayerStore((s) => s.role)
  const roomCode = useMultiplayerStore((s) => s.roomCode)
  const prevSerializedRef = useRef<string>('')

  useEffect(() => {
    if (!role || !roomCode) return

    const socket = getSocket()

    // ── HOST ───────────────────────────────────────────────────────────────
    if (role === 'host') {
      // Broadcast dungeon state whenever it changes
      const unsubscribe = useGameStore.subscribe((state) => {
        const sync = extractSync(state)
        const serialized = JSON.stringify(sync)
        if (serialized === prevSerializedRef.current) return
        prevSerializedRef.current = serialized
        socket.emit('state-update', { code: roomCode, state: sync })
      })

      // Execute guest action requests on the authoritative store
      const handleGuestAction = ({
        action,
      }: {
        playerId: string
        playerName: string
        action: GuestAction
      }) => {
        const store = useGameStore.getState()
        switch (action.type) {
          case 'advance-dungeon':
            store.advanceDungeon()
            break
          case 'select-choice': {
            const event = store.dungeon.currentEvent
            if (event && action.choiceIndex >= 0 && action.choiceIndex < event.choices.length) {
              store.selectChoice(event.choices[action.choiceIndex])
            }
            break
          }
          case 'select-map-node':
            store.selectMapNode(action.nodeId)
            break
          case 'retreat':
            store.retreatFromDungeon()
            break
          case 'start-dungeon':
            store.startDungeon(action.startingFloor, action.alkahestCost)
            break
        }
      }

      socket.on('guest-action', handleGuestAction)

      return () => {
        unsubscribe()
        socket.off('guest-action', handleGuestAction)
      }
    }

    // ── GUEST ──────────────────────────────────────────────────────────────
    if (role === 'guest') {
      const handleStateUpdate = (state: MultiplayerSyncState) => {
        const local = useGameStore.getState()
        if (state.activeRun?.result === 'active') {
          // Run is live – host is authoritative for dungeon + party
          local.applyMultiplayerState(state)
        } else {
          // No active run – only sync run metadata so the guest's own
          // town / party setup / hero roster is never clobbered.
          local.applyMultiplayerState({
            ...state,
            party:   local.party,
            dungeon: local.dungeon,
          })
        }
      }

      socket.on('state-update', handleStateUpdate)

      return () => {
        socket.off('state-update', handleStateUpdate)
      }
    }
  }, [role, roomCode])
}
