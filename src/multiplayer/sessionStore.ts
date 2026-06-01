/**
 * Session-level Zustand store for multiplayer party composition and social features.
 *
 * Tracks which player owns which party slots, their hero contributions,
 * player profiles (for town visiting), and loot distribution at run end.
 *
 * This store is NOT persisted to IndexedDB – it lives only while the
 * multiplayer session is active.
 */

import { create } from 'zustand'
import {
  calculateSlotOwnership,
  getSlotsForPlayerIndex,
  MULTIPLAYER_CONFIG,
} from '@/config/multiplayerConfig'
import type { SlotAssignment, PlayerProfile } from './types'
import type { Item } from '@/types'

interface SessionState {
  // ── Slot assignment ────────────────────────────────────────────────────────
  /** slotIndex → SlotAssignment (null = unclaimed / no guest hero) */
  slotAssignments: Record<number, SlotAssignment | null>

  /**
   * Which player index (0 = host, 1 = first guest, …) owns each slot.
   * Array index = slot index, value = player index.
   */
  slotOwnershipByIndex: number[]

  // ── Player profiles ────────────────────────────────────────────────────────
  /** Public profiles broadcast by each connected player. */
  playerProfiles: Record<string, PlayerProfile>

  // ── Loot pot (pending distribution at run end) ─────────────────────────────
  pendingLoot: Array<{ item: Item; preferredPlayerId: string | null }>
  pendingGold: Record<string, number> // playerId → gold amount

  // ── Actions ───────────────────────────────────────────────────────────────
  /**
   * (Re)calculate slot ownership for the current number of connected players.
   * Call this whenever the player list changes.
   */
  initSlotOwnership: (playerCount: number) => void

  /** Apply a full slot assignment map received from the host. */
  setSlotAssignments: (assignments: Record<number, SlotAssignment | null>) => void

  /** Set a single slot assignment (host-side write OR received from server). */
  setSlotAssignment: (slotIndex: number, assignment: SlotAssignment | null) => void

  /** Remove all slot assignments (called when a run ends or session resets). */
  clearSlotAssignments: () => void

  /** Update or add a player profile. */
  updatePlayerProfile: (playerId: string, profile: PlayerProfile) => void

  /** Remove a player's profile (called on disconnect). */
  removePlayerProfile: (playerId: string) => void

  /** Store pending loot from the run for distribution. */
  setPendingLoot: (items: Array<{ item: Item; preferredPlayerId: string | null }>, gold: Record<string, number>) => void

  /** Clear pending loot (after distribution is applied). */
  clearPendingLoot: () => void

  // ── Derived helpers ────────────────────────────────────────────────────────
  /**
   * Return the slot indices owned by the given player socket id,
   * based on their position in the ordered players array.
   */
  getSlotsForPlayer: (playerId: string, orderedPlayerIds: string[]) => number[]

  /**
   * Return the player index (0=host, 1…) for the given socket id.
   */
  getPlayerIndex: (playerId: string, orderedPlayerIds: string[]) => number
}

export const useSessionStore = create<SessionState>((set, get) => ({
  slotAssignments: {},
  slotOwnershipByIndex: [],
  playerProfiles: {},
  pendingLoot: [],
  pendingGold: {},

  initSlotOwnership: (playerCount) => {
    const ownership = calculateSlotOwnership(
      playerCount,
      MULTIPLAYER_CONFIG.maxPartySize,
    )
    set({ slotOwnershipByIndex: ownership, slotAssignments: {} })
  },

  setSlotAssignments: (assignments) => set({ slotAssignments: assignments }),

  setSlotAssignment: (slotIndex, assignment) =>
    set((s) => ({
      slotAssignments: { ...s.slotAssignments, [slotIndex]: assignment },
    })),

  clearSlotAssignments: () => set({ slotAssignments: {} }),

  updatePlayerProfile: (playerId, profile) =>
    set((s) => ({
      playerProfiles: { ...s.playerProfiles, [playerId]: profile },
    })),

  removePlayerProfile: (playerId) =>
    set((s) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [playerId]: _removed, ...rest } = s.playerProfiles
      return { playerProfiles: rest }
    }),

  setPendingLoot: (items, gold) =>
    set({ pendingLoot: items, pendingGold: gold }),

  clearPendingLoot: () => set({ pendingLoot: [], pendingGold: {} }),

  getSlotsForPlayer: (playerId, orderedPlayerIds) => {
    const idx = orderedPlayerIds.indexOf(playerId)
    if (idx === -1) return []
    return getSlotsForPlayerIndex(idx, get().slotOwnershipByIndex)
  },

  getPlayerIndex: (playerId, orderedPlayerIds) =>
    orderedPlayerIds.indexOf(playerId),
}))
