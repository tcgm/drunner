/**
 * Hero Board actions module
 * Manages the pool of hireable heroes shown in the Guild Hall.
 */

import type { StateCreator } from 'zustand'
import type { GameState, Item, Consumable } from '@/types'
import type { HireableHero } from '@/types'
import { generateHeroBoard, hireableHeroToHero } from '@/systems/heroGeneration'
import { calculateTotalStats } from '@/utils/statCalculator'

/** How often the Hero Board refreshes (ms). Default: 4 hours */
const HERO_BOARD_REFRESH_MS = 4 * 60 * 60 * 1000

/** Number of heroes shown on the board at once */
const HERO_BOARD_SIZE = 6

export interface HeroBoardActionsSlice {
  /** Refresh/generate available heroes, respecting the cooldown unless forced */
  refreshHeroBoard: (force?: boolean) => void
  /** Hire a hero from the board, spending gold and adding them to the roster */
  hireHero: (heroId: string) => void
  /** Pass on a board hero (removes from board; unique heroes can reappear later) */
  passHero: (heroId: string) => void
  /** Fire a roster hero, depositing all their gear into the bank */
  dismissHero: (heroId: string) => void
}

export const createHeroBoardActions: StateCreator<
  GameState & HeroBoardActionsSlice,
  [],
  [],
  HeroBoardActionsSlice
> = (set) => ({
  refreshHeroBoard: (force = false) =>
    set((state) => {
      const now = Date.now()
      const elapsed = now - (state.heroBoardLastRefreshed ?? 0)
      if (!force && elapsed < HERO_BOARD_REFRESH_MS && state.availableHeroesForHire.length > 0) {
        return state
      }
      return {
        availableHeroesForHire: generateHeroBoard(HERO_BOARD_SIZE, now, {
          hiredUniqueIds: state.hiredUniqueHeroIds ?? [],
          dismissedUniqueIds: state.dismissedUniqueHeroIds ?? [],
        }),
        heroBoardLastRefreshed: now,
      }
    }),

  hireHero: (heroId) =>
    set((state) => {
      const hireable = state.availableHeroesForHire.find((h: HireableHero) => h.id === heroId)
      if (!hireable) return state
      if (state.bankGold < hireable.hireCost) return state

      const newHero = hireableHeroToHero(hireable)
      const effectiveMaxHp = calculateTotalStats(newHero).maxHp
      const readyHero = { ...newHero, stats: { ...newHero.stats, hp: effectiveMaxHp } }

      const hiredUniqueHeroIds = hireable.uniqueHeroId
        ? [...(state.hiredUniqueHeroIds ?? []), hireable.uniqueHeroId]
        : (state.hiredUniqueHeroIds ?? [])

      return {
        bankGold: state.bankGold - hireable.hireCost,
        heroRoster: [...state.heroRoster, readyHero],
        availableHeroesForHire: state.availableHeroesForHire.filter((h: HireableHero) => h.id !== heroId),
        hiredUniqueHeroIds,
      }
    }),

  passHero: (heroId) =>
    set((state) => {
      const hireable = state.availableHeroesForHire.find((h: HireableHero) => h.id === heroId)
      if (!hireable) return state

      // Unique heroes that are passed get added to dismissedUniqueHeroIds
      // (they can reappear on a future board, unlike hired ones)
      const dismissedUniqueHeroIds = hireable.uniqueHeroId
        ? [...(state.dismissedUniqueHeroIds ?? []), hireable.uniqueHeroId]
        : (state.dismissedUniqueHeroIds ?? [])

      return {
        availableHeroesForHire: state.availableHeroesForHire.filter((h: HireableHero) => h.id !== heroId),
        dismissedUniqueHeroIds,
      }
    }),

  dismissHero: (heroId) =>
    set((state) => {
      const hero = state.heroRoster.find(h => h.id === heroId)
      if (!hero) return state

      // Collect all items from the hero's slots
      const gearToBank: Item[] = []
      if (hero.slots) {
        for (const slotItem of Object.values(hero.slots)) {
          if (slotItem && !('uses' in slotItem)) {
            // It's an Item (not a Consumable)
            gearToBank.push(slotItem as Item)
          }
        }
      }

      const bankSpace = state.bankStorageSlots - state.bankInventory.length
      const itemsForBank = gearToBank.slice(0, bankSpace)

      // If this was a unique hero, remove from hiredUniqueHeroIds so they can reappear on the board
      const hiredUniqueHeroIds = hero.uniqueHeroId
        ? (state.hiredUniqueHeroIds ?? []).filter(uid => uid !== hero.uniqueHeroId)
        : (state.hiredUniqueHeroIds ?? [])

      return {
        heroRoster: state.heroRoster.filter(h => h.id !== heroId),
        party: state.party.map(p => (p && p.id === heroId ? null : p)),
        bankInventory: [...state.bankInventory, ...itemsForBank],
        hiredUniqueHeroIds,
      }
    }),
})
