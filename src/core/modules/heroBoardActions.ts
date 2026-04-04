/**
 * Hero Board actions module
 * Manages the pool of hireable heroes shown in the Guild Hall.
 *
 * Heroes trickle in one at a time (heroArrivalIntervalHours) up to boardSize.
 * Each hero card expires after heroExpiryHours.
 * Players can "Call for Adventurers" to immediately add heroes, subject to a cooldown.
 */

import type { StateCreator } from 'zustand'
import type { GameState, Item } from '@/types'
import type { HireableHero } from '@/types'
import { generateHireableHero, generateHeroBoard, hireableHeroToHero } from '@/systems/heroGeneration'
import { calculateTotalStats } from '@/utils/statCalculator'
import { GUILD_HERO_CONFIG } from '@/config/guildHeroConfig'

export interface HeroBoardActionsSlice {
  /**
   * Trickle tick — prune expired heroes, add any that are due based on the
   * arrival interval. Pass `force = true` to immediately fill the board.
   */
  refreshHeroBoard: (force?: boolean) => void
  /**
   * "Call for Adventurers" — instantly recruits up to callHeroCount heroes.
   * Returns false if the action is still on cooldown.
   */
  callForHeroes: () => boolean
  /** Clear all current heroes off the board (they can reappear later) */
  clearHeroBoard: () => void
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
  > = (set, get) => ({
  refreshHeroBoard: (force = false) =>
    set((state) => {
      const now = Date.now()
      const arrivalMs = GUILD_HERO_CONFIG.heroArrivalIntervalHours * GUILD_HERO_CONFIG.msPerHour
      const expiryMs = GUILD_HERO_CONFIG.heroExpiryHours * GUILD_HERO_CONFIG.msPerHour

      // Prune heroes that have overstayed their welcome
      const fresh = state.availableHeroesForHire.filter(
        h => (h.arrivedAt ?? 0) + expiryMs > now
      )

      if (force) {
        // Fill the board immediately regardless of timing
        const board = generateHeroBoard(GUILD_HERO_CONFIG.boardSize, now, {
          hiredUniqueIds: state.hiredUniqueHeroIds ?? [],
          dismissedUniqueIds: state.dismissedUniqueHeroIds ?? [],
        })
        return { availableHeroesForHire: board, heroBoardLastRefreshed: now }
      }

      // How many arrival intervals have elapsed since the last hero arrived?
      const lastArrival = state.heroBoardLastRefreshed ?? 0
      const slotsElapsed = lastArrival === 0
        ? GUILD_HERO_CONFIG.boardSize  // first ever open → fill the board
        : Math.floor((now - lastArrival) / arrivalMs)

      if (slotsElapsed <= 0 && fresh.length === state.availableHeroesForHire.length) {
      // Nothing expired and no new slots — nothing to do
        return state
      }

      const openSlots = GUILD_HERO_CONFIG.boardSize - fresh.length
      const toAdd = Math.min(slotsElapsed, openSlots)
      const newHeroes: HireableHero[] = []
      for (let i = 0; i < toAdd; i++) {
        newHeroes.push(generateHireableHero(now + i * 0x9e3779b9, now))
      }

      const newLastArrival = toAdd > 0
        ? (lastArrival === 0 ? now : lastArrival + toAdd * arrivalMs)
        : state.heroBoardLastRefreshed

      return {
        availableHeroesForHire: [...fresh, ...newHeroes],
        heroBoardLastRefreshed: newLastArrival,
      }
    }),

    callForHeroes: () => {
      const state = get()
      const now = Date.now()
      if (now < (state.heroBoardCallCooldownUntil ?? 0)) return false

      set((s) => {
        const expiryMs = GUILD_HERO_CONFIG.heroExpiryHours * GUILD_HERO_CONFIG.msPerHour
        const fresh = s.availableHeroesForHire.filter(h => (h.arrivedAt ?? 0) + expiryMs > now)
        const openSlots = GUILD_HERO_CONFIG.boardSize - fresh.length
        const toAdd = Math.min(GUILD_HERO_CONFIG.callHeroCount, openSlots)
        const newHeroes: HireableHero[] = []
        for (let i = 0; i < toAdd; i++) {
          newHeroes.push(generateHireableHero(now + i * 0x1337cafe, now))
        }
        const cooldownUntil = now + GUILD_HERO_CONFIG.callCooldownHours * GUILD_HERO_CONFIG.msPerHour
        return {
          availableHeroesForHire: [...fresh, ...newHeroes],
          heroBoardCallCooldownUntil: cooldownUntil,
      }
    })
      return true
    },

    clearHeroBoard: () =>
      set((state) => {
        const dismissedUniqueHeroIds = [
          ...(state.dismissedUniqueHeroIds ?? []),
          ...state.availableHeroesForHire
            .filter(h => h.uniqueHeroId)
            .map(h => h.uniqueHeroId as string),
        ]
        return { availableHeroesForHire: [], dismissedUniqueHeroIds, heroBoardLastRefreshed: Date.now() }
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
