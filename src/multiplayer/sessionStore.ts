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
import type { SlotAssignment, PlayerProfile, VoteState, NodeVoteState, RetreatVoteState, DraftState } from './types'
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

  // ── Voting ─────────────────────────────────────────────────────────────────
  /** Live vote tally for the current event. Null when no vote is active. */
  voteState: VoteState | null
  /** Live vote tally for map node selection. Null when no vote is active. */
  nodeVoteState: NodeVoteState | null
  /** Live tally of who has agreed to retreat. Null when no one has voted to retreat. */
  retreatVoteState: RetreatVoteState | null

  // ── Loot draft ─────────────────────────────────────────────────────────────
  /** Active draft state. Null when no draft is in progress. */
  draftState: DraftState | null

  // ── Combat action queue ────────────────────────────────────────────────────
  /**
   * Pre-queued combat actions. heroId → action string.
   * The host's BossCombatScreen watches this and auto-fires when a queued
   * hero's turn arrives.
   */
  combatQueue: Record<string, string>

  // ── Ready-up ───────────────────────────────────────────────────────────────
  /** Socket IDs of players who have clicked "I'm Ready" on the dungeon-prep screen. */
  readyPlayers: string[]

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

  /** Set or clear the current vote state. */
  setVoteState: (vs: VoteState | null) => void
  /** Set or clear the current node vote state. */
  setNodeVoteState: (vs: NodeVoteState | null) => void
  /** Set or clear the current retreat vote state. */
  setRetreatVoteState: (vs: RetreatVoteState | null) => void

  /** Set or clear the active draft state. */
  setDraftState: (ds: DraftState | null) => void

  /** Store a queued combat action for a specific hero. */
  setCombatQueueEntry: (heroId: string, action: string) => void

  /** Remove a queued combat action for a specific hero (after it fires). */
  clearCombatQueueEntry: (heroId: string) => void

  /** Clear all queued combat actions. */
  clearCombatQueue: () => void

  /** Replace the full ready-players list (received from host broadcast). */
  setReadyPlayers: (players: string[]) => void

  /** Clear the ready list (when leaving dungeon prep or starting a run). */
  clearReadyPlayers: () => void

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
  voteState: null,
  nodeVoteState: null,
  retreatVoteState: null,
  draftState: null,
  combatQueue: {},
  readyPlayers: [],

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

  setVoteState: (vs) => set({ voteState: vs }),
  setNodeVoteState: (vs) => set({ nodeVoteState: vs }),
  setRetreatVoteState: (vs) => set({ retreatVoteState: vs }),

  setDraftState: (ds) => set({ draftState: ds }),

  setCombatQueueEntry: (heroId, action) =>
    set((s) => ({ combatQueue: { ...s.combatQueue, [heroId]: action } })),

  clearCombatQueueEntry: (heroId) =>
    set((s) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [heroId]: _removed, ...rest } = s.combatQueue
      return { combatQueue: rest }
    }),

  clearCombatQueue: () => set({ combatQueue: {} }),

  setReadyPlayers: (players) => set({ readyPlayers: players }),

  clearReadyPlayers: () => set({ readyPlayers: [] }),

  getSlotsForPlayer: (playerId, orderedPlayerIds) => {
    const idx = orderedPlayerIds.indexOf(playerId)
    if (idx === -1) return []
    return getSlotsForPlayerIndex(idx, get().slotOwnershipByIndex)
  },

  getPlayerIndex: (playerId, orderedPlayerIds) =>
    orderedPlayerIds.indexOf(playerId),
}))
