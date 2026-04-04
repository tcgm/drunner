/**
 * Hero Board actions module
 * Manages the pool of hireable heroes shown in the Guild Hall.
 */

import type { StateCreator } from 'zustand'
import type { GameState } from '@/types'
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
        availableHeroesForHire: generateHeroBoard(HERO_BOARD_SIZE, now),
        heroBoardLastRefreshed: now,
      }
    }),

  hireHero: (heroId) =>
    set((state) => {
      const hireable = state.availableHeroesForHire.find((h: HireableHero) => h.id === heroId)
      if (!hireable) return state
      if (state.bankGold < hireable.hireCost) return state

      const newHero = hireableHeroToHero(hireable)
      // Heal to full effective HP
      const effectiveMaxHp = calculateTotalStats(newHero).maxHp
      const readyHero = { ...newHero, stats: { ...newHero.stats, hp: effectiveMaxHp } }

      return {
        bankGold: state.bankGold - hireable.hireCost,
        heroRoster: [...state.heroRoster, readyHero],
        availableHeroesForHire: state.availableHeroesForHire.filter((h: HireableHero) => h.id !== heroId),
      }
    }),
})
