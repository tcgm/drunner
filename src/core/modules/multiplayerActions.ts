/**
 * Multiplayer actions module
 *
 * Provides:
 *   applyMultiplayerState  – guests overwrite dungeon state from host broadcast
 *   setGuestHeroAtSlot     – host adds a guest-contributed hero to a party slot
 *                            WITHOUT touching the host's own hero roster
 *   applyHeroReturn        – guests update a roster hero with the version that
 *                            came back from the host after a run
 *   applyRunLoot           – guests add items / gold received from the host at
 *                            run end to their bank
 */

import type { StateCreator } from 'zustand'
import type { GameState, Hero, Item } from '@/types'
import { calculateTotalStats } from '@/utils/statCalculator'

/** The subset of GameState received from the host. */
interface MultiplayerSyncPayload {
  dungeon: GameState['dungeon']
  party: GameState['party']
  isGameOver: boolean
  isPaused: boolean
  lastOutcome: GameState['lastOutcome']
  activeRun: GameState['activeRun']
}

export interface MultiplayerActionsSlice {
  applyMultiplayerState: (payload: MultiplayerSyncPayload) => void
  setGuestHeroAtSlot: (hero: Hero, slotIndex: number) => void
  clearGuestHeroAtSlot: (slotIndex: number) => void
  updateGuestHeroAtSlot: (hero: Hero, slotIndex: number) => void
  setDungeonInventory: (items: Item[]) => void
  applyHeroReturn: (heroSourceId: string, updatedHero: Hero) => void
  applyRunLoot: (items: Item[], gold: number) => void
}

export const createMultiplayerActions: StateCreator<
  GameState & MultiplayerActionsSlice,
  [],
  [],
  MultiplayerActionsSlice
> = (set) => ({
  // ── Guest receives full dungeon state from host ──────────────────────────
  applyMultiplayerState: (payload) =>
    set({
      dungeon:     payload.dungeon,
      party:       payload.party,
      isGameOver:  payload.isGameOver,
      isPaused:    payload.isPaused,
      lastOutcome: payload.lastOutcome,
      activeRun:   payload.activeRun,
    }),

  // ── Host places a guest-contributed hero into a party slot ───────────────
  // The hero is NOT added to the host's roster; it exists only in the party
  // array for the duration of the run.
  setGuestHeroAtSlot: (hero, slotIndex) =>
    set((state) => {
      if (slotIndex < 0 || slotIndex >= state.party.length) return state
      if (state.party[slotIndex] !== null) return state // slot already occupied

      // Heal contributed hero to full HP
      const maxHp = calculateTotalStats(hero).maxHp
      const healed: Hero = { ...hero, stats: { ...hero.stats, hp: maxHp } }

      const newParty = [...state.party]
      newParty[slotIndex] = healed
      return { party: newParty }
    }),

  // ── Host removes a guest hero from a party slot (slot release) ───────────
  clearGuestHeroAtSlot: (slotIndex) =>
    set((state) => {
      if (slotIndex < 0 || slotIndex >= state.party.length) return state
      const newParty = [...state.party]
      newParty[slotIndex] = null
      return { party: newParty }
    }),

  // ── Host updates an existing guest hero in a slot (equipment sync) ────────
  // Unlike setGuestHeroAtSlot, this overwrites an occupied slot and does not heal.
  updateGuestHeroAtSlot: (hero, slotIndex) =>
    set((state) => {
      if (slotIndex < 0 || slotIndex >= state.party.length) return state
      const newParty = [...state.party]
      newParty[slotIndex] = hero
      return { party: newParty }
    }),

  // ── Host applies the shared dungeon loot pool reported by a guest after ──
  // they equipped/unequipped an item from it, keeping the run's shared
  // inventory consistent so the same item can't be claimed twice.
  setDungeonInventory: (items) =>
    set((state) => ({ dungeon: { ...state.dungeon, inventory: items } })),

  // ── Guest applies updated hero state returned by host after run ──────────
  applyHeroReturn: (heroSourceId, updatedHero) =>
    set((state) => {
      const idx = state.heroRoster.findIndex((h) => h.id === heroSourceId)
      if (idx === -1) return state // hero not found – nothing to update
      const newRoster = [...state.heroRoster]
      newRoster[idx] = updatedHero
      return { heroRoster: newRoster }
    }),

  // ── Guest receives items and gold from host at run end ───────────────────
  applyRunLoot: (items, gold) =>
    set((state) => {
      const newBank = [...state.bankInventory, ...items]
      return {
        bankInventory: newBank,
        bankGold: state.bankGold + gold,
      }
    }),
})

