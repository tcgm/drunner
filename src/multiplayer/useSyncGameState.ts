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
import { useSessionStore } from './sessionStore'
import { recordVote, initVotes, clearVotes } from './voteManager'
import type { MultiplayerSyncState, GuestAction, DraftState } from './types'
import type { Item } from '@/types'

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
  const players = useMultiplayerStore((s) => s.players)
  const prevSerializedRef = useRef<string>('')
  const prevEventIdRef = useRef<string | null | undefined>(undefined)

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

        // Re-init votes when a new event arrives (event id changed) or event clears
        const eventId = state.dungeon.currentEvent?.id ?? null
        if (eventId !== prevEventIdRef.current) {
          prevEventIdRef.current = eventId
          if (eventId !== null) {
            initVotes(players.length, roomCode)
          } else {
            clearVotes()
          }
        }
      })

      // Execute guest action requests on the authoritative store
      const handleGuestAction = ({
        playerId,
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
            // Legacy path – kept for backwards compat; voting uses cast-vote
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
          case 'combat-action':
            // Store in queue; BossCombatScreen auto-fires it on the hero's turn
            useSessionStore.getState().setCombatQueueEntry(action.heroId, action.action)
            break
        }
      }

      // Handle vote cast from guests
      const handleCastVote = ({ playerId, choiceIndex }: { playerId: string; choiceIndex: number }) => {
        recordVote(playerId, choiceIndex)
      }

      socket.on('guest-action', handleGuestAction)
      socket.on('cast-vote', handleCastVote)

      return () => {
        unsubscribe()
        socket.off('guest-action', handleGuestAction)
        socket.off('cast-vote', handleCastVote)
        clearVotes()
      }
    }

    // ── GUEST ──────────────────────────────────────────────────────────────
    if (role === 'guest') {
      const handleStateUpdate = (state: MultiplayerSyncState) => {
        const local = useGameStore.getState()
        if (state.activeRun?.result === 'active') {
          local.applyMultiplayerState(state)
        } else {
          local.applyMultiplayerState({
            ...state,
            party:   local.party,
            dungeon: local.dungeon,
          })
        }
      }

      // Live vote tally from host
      const handleVoteUpdate = ({ votes, totalPlayers }: { votes: Record<string, number>; totalPlayers: number }) => {
        useSessionStore.getState().setVoteState({ votes, totalPlayers })
      }

      // Draft started by host at run end
      const handleDraftStart = (ds: Omit<DraftState, 'picks'> & { picks?: Record<string, Item[]> }) => {
        useSessionStore.getState().setDraftState({
          ...ds,
          picks: ds.picks ?? {},
        } as DraftState)
      }

      // Draft updated after each pick
      const handleDraftUpdate = ({
        pool,
        picks,
        currentPickerIndex,
        order,
      }: {
        pool: DraftState['pool']
        picks: DraftState['picks']
        currentPickerIndex: number
        order: string[]
      }) => {
        const current = useSessionStore.getState().draftState
        if (!current) return
        useSessionStore.getState().setDraftState({
          ...current,
          pool,
          picks,
          currentPickerIndex,
          order,
        })
      }

      socket.on('state-update', handleStateUpdate)
      socket.on('vote-update', handleVoteUpdate)
      socket.on('draft-start', handleDraftStart)
      socket.on('draft-update', handleDraftUpdate)

      return () => {
        socket.off('state-update', handleStateUpdate)
        socket.off('vote-update', handleVoteUpdate)
        socket.off('draft-start', handleDraftStart)
        socket.off('draft-update', handleDraftUpdate)
      }
    }
  }, [role, roomCode, players.length])
}
