/**
 * usePartySync
 *
 * Central hook for the expanded multiplayer party system.
 * Mount once at app level (alongside useSyncGameState).
 *
 * Responsibilities:
 *  HOST
 *    - Re-init slot ownership whenever the player count changes
 *    - Listen for guest-slot-claimed  → apply guest hero to party store slot
 *    - Listen for guest-slot-released → clear party slot
 *    - After each change broadcast updated slot assignments to all clients
 *    - Listen for broadcast-profile events from guests and update sessionStore
 *
 *  GUEST
 *    - Re-init slot ownership when player count changes
 *    - Listen for slot-assignments-update → sync sessionStore
 *    - Listen for run-ended             → apply hero returns + loot
 *    - Listen for player-profile-update → update sessionStore
 *    - Provide claimSlot / releaseSlot helpers for the UI
 *
 *  ALL
 *    - Broadcast own PlayerProfile whenever relevant state changes
 */

import { useEffect, useCallback, useRef } from 'react'
import { useMultiplayerStore } from './multiplayerStore'
import { useSessionStore } from './sessionStore'
import { getSocket } from './socket'
import { useGameStore } from '@/core/gameStore'
import type { SlotAssignment, PlayerProfile } from './types'
import type { Hero, Item } from '@/types'

export function usePartySync() {
  const role      = useMultiplayerStore((s) => s.role)
  const roomCode  = useMultiplayerStore((s) => s.roomCode)
  const players   = useMultiplayerStore((s) => s.players)

  const party      = useGameStore((s) => s.party)
  const bankGold   = useGameStore((s) => s.bankGold)

  const initSlotOwnership    = useSessionStore((s) => s.initSlotOwnership)
  const setSlotAssignment    = useSessionStore((s) => s.setSlotAssignment)
  const setSlotAssignments   = useSessionStore((s) => s.setSlotAssignments)
  const updatePlayerProfile  = useSessionStore((s) => s.updatePlayerProfile)
  const removePlayerProfile  = useSessionStore((s) => s.removePlayerProfile)

  // ── Slot ownership: recalculate whenever player count changes ─────────────
  useEffect(() => {
    if (!role) return
    initSlotOwnership(players.length)
  }, [role, players.length, initSlotOwnership])

  // ── Clean up profiles for disconnected players ────────────────────────────
  useEffect(() => {
    const profileIds = Object.keys(useSessionStore.getState().playerProfiles)
    const activeIds  = players.map((p) => p.id)
    for (const pid of profileIds) {
      if (!activeIds.includes(pid)) removePlayerProfile(pid)
    }
  }, [players, removePlayerProfile])

  // ── Broadcast own profile whenever roster / gold / location change ─────────
  const profileRef = useRef<string>('')
  useEffect(() => {
    if (!role || !roomCode) return
    const socket = getSocket()
    if (!socket.id) return

    const profile: PlayerProfile = {
      playerId:          socket.id,
      playerName:        useMultiplayerStore.getState().localPlayerName,
      heroRosterPreview: party
        .filter((h): h is import('@/types').Hero => h !== null)
        .map((h) => ({
          id:        h.id,
          name:      h.name,
          className: h.class.name,
          classIcon: h.class.icon,
          level:     h.level,
        })),
      bankGold,
      currentLocation: 'town',
    }

    const serialised = JSON.stringify(profile)
    if (serialised === profileRef.current) return // no change
    profileRef.current = serialised

    // Store own profile locally — server only relays to others, not back to sender
    updatePlayerProfile(socket.id, profile)
    socket.emit('broadcast-profile', { code: roomCode, profile })
  }, [role, roomCode, party, bankGold, updatePlayerProfile])

  // ── Re-broadcast own profile when a peer asks for it ─────────────────────
  // This fires when a new player joins and requests profiles from existing players.
  useEffect(() => {
    if (!role || !roomCode) return
    const socket = getSocket()

    const onProfileRequest = () => {
      // Reset the dedupe ref so the broadcast effect runs again unconditionally
      profileRef.current = ''
    }

    socket.on('profile-request', onProfileRequest)
    return () => { socket.off('profile-request', onProfileRequest) }
  }, [role, roomCode])

  // ── Host-side socket listeners ────────────────────────────────────────────
  useEffect(() => {
    if (role !== 'host' || !roomCode) return
    const socket = getSocket()

    const onGuestSlotClaimed = ({
      playerId,
      playerName,
      slotIndex,
      heroSnapshot,
      heroSourceId,
    }: {
      playerId: string
      playerName: string
      slotIndex: number
      heroSnapshot: Hero
      heroSourceId: string
    }) => {
      // Place hero in party store (host-authoritative)
      useGameStore.getState().setGuestHeroAtSlot(heroSnapshot, slotIndex)

      const assignment: SlotAssignment = { playerId, playerName, heroSnapshot, heroSourceId }
      setSlotAssignment(slotIndex, assignment)

      // Broadcast updated assignment map to all guests
      const updatedAssignments = {
        ...useSessionStore.getState().slotAssignments,
        [slotIndex]: assignment,
      }
      socket.emit('slot-assignments-update', { code: roomCode, assignments: updatedAssignments })
    }

    const onGuestSlotReleased = ({
      playerId,
      slotIndex,
    }: {
      playerId: string
      slotIndex: number
    }) => {
      const assignment = useSessionStore.getState().slotAssignments[slotIndex]
      if (assignment?.playerId !== playerId) return // guard against spoofing

      useGameStore.getState().clearGuestHeroAtSlot(slotIndex)
      setSlotAssignment(slotIndex, null)

      const updatedAssignments = {
        ...useSessionStore.getState().slotAssignments,
        [slotIndex]: null,
      }
      socket.emit('slot-assignments-update', { code: roomCode, assignments: updatedAssignments })
    }

    const onProfileUpdate = ({
      playerId,
      profile,
    }: {
      playerId: string
      profile: PlayerProfile
    }) => {
      updatePlayerProfile(playerId, profile)
    }

    socket.on('guest-slot-claimed',    onGuestSlotClaimed)
    socket.on('guest-slot-released',   onGuestSlotReleased)
    socket.on('player-profile-update', onProfileUpdate)

    return () => {
      socket.off('guest-slot-claimed',    onGuestSlotClaimed)
      socket.off('guest-slot-released',   onGuestSlotReleased)
      socket.off('player-profile-update', onProfileUpdate)
    }
  }, [role, roomCode, setSlotAssignment, updatePlayerProfile])

  // ── Guest-side socket listeners ───────────────────────────────────────────
  useEffect(() => {
    if (role !== 'guest' || !roomCode) return
    const socket = getSocket()

    const onSlotAssignmentsUpdate = ({
      assignments,
    }: {
      assignments: Record<number, SlotAssignment | null>
    }) => {
      setSlotAssignments(assignments)
    }

    const onRunEnded = ({
      heroReturns,
      loot,
      gold,
      run,
    }: {
      heroReturns: Record<string, Hero> // heroSourceId → updatedHero
      loot: Item[]
      gold: number
      run: unknown // Run type
    }) => {
      const store = useGameStore.getState()

      // Apply each returned hero back into the local roster
      for (const [heroSourceId, updatedHero] of Object.entries(heroReturns)) {
        store.applyHeroReturn(heroSourceId, updatedHero as Hero)
      }

      // Add items and gold to bank
      if (loot.length > 0 || gold > 0) {
        store.applyRunLoot(loot as Item[], gold)
      }

      // Process quest progress for this run
      if (run && typeof (store as Record<string, unknown>).processRunForQuests === 'function') {
        ;(store as Record<string, unknown>).processRunForQuests(run)
      }
    }

    const onProfileUpdate = ({
      playerId,
      profile,
    }: {
      playerId: string
      profile: PlayerProfile
    }) => {
      updatePlayerProfile(playerId, profile)
    }

    socket.on('slot-assignments-update', onSlotAssignmentsUpdate)
    socket.on('run-ended',               onRunEnded)
    socket.on('player-profile-update',   onProfileUpdate)

    return () => {
      socket.off('slot-assignments-update', onSlotAssignmentsUpdate)
      socket.off('run-ended',               onRunEnded)
      socket.off('player-profile-update',   onProfileUpdate)
    }
  }, [role, roomCode, setSlotAssignments, updatePlayerProfile])

  // ── Slot helpers exposed to party-setup UI ─────────────────────────────
  const claimSlot = useCallback(
    (slotIndex: number, hero: Hero) => {
      if (!roomCode) return

      if (role === 'host') {
        const socket = getSocket()
        // Clear whatever is in this slot first, then place the new hero
        useGameStore.getState().clearGuestHeroAtSlot(slotIndex)
        useGameStore.getState().setGuestHeroAtSlot(hero, slotIndex)
        const assignment: SlotAssignment = {
          playerId:      socket.id ?? 'host',
          playerName:    useMultiplayerStore.getState().localPlayerName,
          heroSnapshot:  hero,
          heroSourceId:  hero.id,
        }
        setSlotAssignment(slotIndex, assignment)
        // Broadcast updated assignments to guests
        const updatedAssignments = {
          ...useSessionStore.getState().slotAssignments,
          [slotIndex]: assignment,
        }
        socket.emit('slot-assignments-update', { code: roomCode, assignments: updatedAssignments })
        return
      }

      if (role === 'guest') {
        const socket = getSocket()
        socket.emit('claim-slot', {
          code:         roomCode,
          slotIndex,
          heroSnapshot: hero,
          heroSourceId: hero.id,
        })
      }
    },
    [role, roomCode, setSlotAssignment],
  )

  const releaseSlot = useCallback(
    (slotIndex: number) => {
      if (!roomCode) return

      if (role === 'host') {
        const socket = getSocket()
        useGameStore.getState().clearGuestHeroAtSlot(slotIndex)
        setSlotAssignment(slotIndex, null)
        const updatedAssignments = {
          ...useSessionStore.getState().slotAssignments,
          [slotIndex]: null,
        }
        socket.emit('slot-assignments-update', { code: roomCode, assignments: updatedAssignments })
        return
      }

      if (role === 'guest') {
        const socket = getSocket()
        socket.emit('release-slot', { code: roomCode, slotIndex })
      }
    },
    [role, roomCode, setSlotAssignment],
  )

  /**
   * Called by the HOST at run end.
   * Builds hero returns and the draft pool, then broadcasts draft-start to
   * guests so a LootDraftModal can open on every client.
   * The actual loot distribution happens only after the draft completes.
   */
  const distributeRunEnd = useCallback(() => {
    if (role !== 'host' || !roomCode) return
    const socket       = getSocket()
    const gameState    = useGameStore.getState()
    const sessionState = useSessionStore.getState()

    const assignments  = sessionState.slotAssignments
    const dungeonItems = gameState.dungeon.inventory ?? []
    const dungeonGold  = gameState.dungeon.gold       ?? 0

    // Build hero returns: for each assigned slot, return the current party hero
    // to its owning player.
    const heroReturnsByPlayer: Record<string, Record<string, Hero>> = {}
    for (const [slotStr, assignment] of Object.entries(assignments)) {
      if (!assignment) continue
      const slotIdx     = Number(slotStr)
      const updatedHero = gameState.party[slotIdx]
      if (!updatedHero) continue
      const { playerId, heroSourceId } = assignment
      if (!heroReturnsByPlayer[playerId]) heroReturnsByPlayer[playerId] = {}
      heroReturnsByPlayer[playerId][heroSourceId] = updatedHero
    }

    // Split gold evenly (not part of the draft — automatic)
    const allPlayerIds  = players.map((p) => p.id)
    const goldPerPlayer = Math.floor(dungeonGold / (allPlayerIds.length || 1))
    const goldByPlayer: Record<string, number> = {}
    for (const pid of allPlayerIds) goldByPlayer[pid] = goldPerPlayer

    const run = gameState.activeRun

    // If there is nothing to draft (no items), skip straight to distribution
    if (dungeonItems.length === 0) {
      _applyRunEnd(socket, roomCode, heroReturnsByPlayer, {}, goldByPlayer, run, allPlayerIds, sessionState)
      return
    }

    // Otherwise start a draft
    const draftState = {
      pool:                 dungeonItems,
      picks:                Object.fromEntries(allPlayerIds.map((id) => [id, []])) as Record<string, Item[]>,
      goldByPlayer,
      heroReturnsByPlayer,
      order:                allPlayerIds,
      currentPickerIndex:   0,
      run,
    }

    // Store locally for the host's LootDraftModal
    sessionState.setDraftState(draftState)

    // Broadcast to guests (server relay sends draft-start to all non-host clients)
    socket.emit('draft-start', {
      code: roomCode,
      pool:                 draftState.pool,
      picks:                draftState.picks,
      goldByPlayer,
      heroReturnsByPlayer,
      order:                draftState.order,
      run,
    })

    // Listen for guest picks while draft is active
    const handleDraftPick = ({ playerId, itemIndex }: { playerId: string; itemIndex: number }) => {
      const current = useSessionStore.getState().draftState
      if (!current) return

      const currentPicker = current.order[current.currentPickerIndex % current.order.length]
      if (playerId !== currentPicker) return // not their turn

      _processDraftPick(socket, roomCode!, current, itemIndex, sessionState, allPlayerIds, run)
    }

    socket.on('draft-pick', handleDraftPick)
    // Cleanup listener once draft is done (handled inside _processDraftPick when pool empties)
    const cleanup = () => socket.off('draft-pick', handleDraftPick)
    ;(socket as typeof socket & { _draftCleanup?: () => void })._draftCleanup = cleanup

    // Clear guest slot assignments now that the run has ended
    sessionState.clearSlotAssignments()
  }, [role, roomCode, players])

  /**
   * Pick an item from the active draft pool.
   * Host applies it directly; guests emit a socket event.
   */
  const pickDraftItem = useCallback(
    (itemIndex: number) => {
      if (!roomCode) return

      if (role === 'host') {
        // Apply directly on the host
        const socket       = getSocket()
        const sessionState = useSessionStore.getState()
        const current      = sessionState.draftState
        if (!current) return
        _processDraftPick(socket, roomCode, current, itemIndex, sessionState, players.map((p) => p.id), current.run)
      } else if (role === 'guest') {
        const socket = getSocket()
        socket.emit('draft-pick', { code: roomCode, itemIndex })
      }
    },
    [role, roomCode, players],
  )

  return { claimSlot, releaseSlot, distributeRunEnd, pickDraftItem }
}

// ── Draft helpers (module-level) ──────────────────────────────────────────────

function _processDraftPick(
  socket: ReturnType<typeof getSocket>,
  roomCode: string,
  current: import('./types').DraftState,
  itemIndex: number,
  sessionState: ReturnType<typeof useSessionStore.getState>,
  allPlayerIds: string[],
  run: unknown,
) {
  if (itemIndex < 0 || itemIndex >= current.pool.length) return

  const pickedItem   = current.pool[itemIndex]
  const newPool      = current.pool.filter((_, i) => i !== itemIndex)
  const currentPicker = current.order[current.currentPickerIndex % current.order.length]
  const newPicks     = {
    ...current.picks,
    [currentPicker]: [...(current.picks[currentPicker] ?? []), pickedItem],
  }
  const newPickerIndex = current.currentPickerIndex + 1

  if (newPool.length === 0) {
    // Draft complete
    sessionState.setDraftState(null)

    // Build final loot map and finish
    const lootByPlayer: Record<string, Item[]> = Object.fromEntries(
      allPlayerIds.map((id) => [id, newPicks[id] ?? []]),
    )

    _applyRunEnd(
      socket, roomCode,
      current.heroReturnsByPlayer,
      lootByPlayer,
      current.goldByPlayer,
      run,
      allPlayerIds,
      sessionState,
    )

    // Remove draft-pick listener
    const s = socket as typeof socket & { _draftCleanup?: () => void }
    if (s._draftCleanup) { s._draftCleanup(); s._draftCleanup = undefined }
  } else {
    // More items remain — update state and broadcast
    const updatedDraft: import('./types').DraftState = {
      ...current,
      pool:               newPool,
      picks:              newPicks,
      currentPickerIndex: newPickerIndex,
    }
    sessionState.setDraftState(updatedDraft)

    socket.emit('draft-update', {
      code:               roomCode,
      pool:               newPool,
      picks:              newPicks,
      currentPickerIndex: newPickerIndex,
      order:              current.order,
    })
  }
}

function _applyRunEnd(
  socket: ReturnType<typeof getSocket>,
  roomCode: string,
  heroReturnsByPlayer: Record<string, Record<string, import('@/types').Hero>>,
  lootByPlayer:        Record<string, import('@/types').Item[]>,
  goldByPlayer:        Record<string, number>,
  run:                 unknown,
  allPlayerIds:        string[],
  sessionState:        ReturnType<typeof useSessionStore.getState>,
) {
  // Ensure all players have entries
  for (const pid of allPlayerIds) {
    if (!lootByPlayer[pid])  lootByPlayer[pid]  = []
    if (!goldByPlayer[pid])  goldByPlayer[pid]  = 0
  }

  // Send personalised payloads to guests
  socket.emit('draft-complete', {
    code: roomCode,
    heroReturnsByPlayer,
    lootByPlayer,
    goldByPlayer,
    run,
  })

  // Apply host's own share immediately
  const hostId = socket.id
  if (hostId) {
    useGameStore.getState().applyRunLoot(lootByPlayer[hostId] ?? [], goldByPlayer[hostId] ?? 0)
  }

  sessionState.clearSlotAssignments()
  sessionState.setDraftState(null)
}

