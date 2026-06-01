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

  const heroRoster = useGameStore((s) => s.heroRoster)
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
      heroRosterPreview: heroRoster.map((h) => ({
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

    socket.emit('broadcast-profile', { code: roomCode, profile })
  }, [role, roomCode, heroRoster, bankGold])

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

    socket.on('guest-slot-claimed',  onGuestSlotClaimed)
    socket.on('guest-slot-released', onGuestSlotReleased)
    socket.on('player-profile',      onProfileUpdate)

    return () => {
      socket.off('guest-slot-claimed',  onGuestSlotClaimed)
      socket.off('guest-slot-released', onGuestSlotReleased)
      socket.off('player-profile',      onProfileUpdate)
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

  // ── Guest helpers exposed to party-setup UI ───────────────────────────────
  const claimSlot = useCallback(
    (slotIndex: number, hero: Hero) => {
      if (role !== 'guest' || !roomCode) return
      const socket = getSocket()
      socket.emit('claim-slot', {
        code:         roomCode,
        slotIndex,
        heroSnapshot: hero,
        heroSourceId: hero.id,
      })
    },
    [role, roomCode],
  )

  const releaseSlot = useCallback(
    (slotIndex: number) => {
      if (role !== 'guest' || !roomCode) return
      const socket = getSocket()
      socket.emit('release-slot', { code: roomCode, slotIndex })
    },
    [role, roomCode],
  )

  /**
   * Called by the HOST at run end to distribute loot and return guest heroes.
   * Reads party + dungeon state from the game store and slot assignments from
   * the session store, then emits the 'run-ended' socket event.
   */
  const distributeRunEnd = useCallback(() => {
    if (role !== 'host' || !roomCode) return
    const socket       = getSocket()
    const gameState    = useGameStore.getState()
    const sessionState = useSessionStore.getState()

    const assignments   = sessionState.slotAssignments
    const dungeonItems  = gameState.dungeon.inventory ?? []
    const dungeonGold   = gameState.dungeon.gold       ?? 0

    // Build hero returns: for each assigned slot, return the current party hero
    // to its owning player.
    const heroReturnsByPlayer: Record<string, Record<string, Hero>> = {}
    for (const [slotStr, assignment] of Object.entries(assignments)) {
      if (!assignment) continue
      const slotIdx       = Number(slotStr)
      const updatedHero   = gameState.party[slotIdx]
      if (!updatedHero) continue

      const { playerId, heroSourceId } = assignment
      if (!heroReturnsByPlayer[playerId]) heroReturnsByPlayer[playerId] = {}
      heroReturnsByPlayer[playerId][heroSourceId] = updatedHero
    }

    // Distribute dungeon items round-robin across ALL players (including host)
    const allPlayerIds = players.map((p) => p.id)
    const lootByPlayer: Record<string, Item[]>  = {}
    const goldByPlayer: Record<string, number>  = {}
    for (const pid of allPlayerIds) { lootByPlayer[pid] = []; goldByPlayer[pid] = 0 }

    dungeonItems.forEach((item, i) => {
      const owner = allPlayerIds[i % allPlayerIds.length]
      lootByPlayer[owner].push(item)
    })

    // Split gold evenly
    const goldPerPlayer = Math.floor(dungeonGold / (allPlayerIds.length || 1))
    for (const pid of allPlayerIds) { goldByPlayer[pid] = goldPerPlayer }

    const run = gameState.activeRun

    socket.emit('run-ended', {
      code: roomCode,
      heroReturnsByPlayer,
      lootByPlayer,
      goldByPlayer,
      run,
    })

    // Apply the host's own share immediately (the event only goes to guests)
    const hostId = socket.id
    if (hostId && lootByPlayer[hostId]) {
      useGameStore.getState().applyRunLoot(lootByPlayer[hostId], goldByPlayer[hostId] ?? 0)
    }

    // Clear guest slot assignments now that the run has ended
    sessionState.clearSlotAssignments()
  }, [role, roomCode, players])

  return { claimSlot, releaseSlot, distributeRunEnd }
}
