/**
 * Middleware module
 * Contains Zustand middleware for sanitizing game state
 */

import type { StateCreator } from 'zustand'
import type { GameState, Hero } from '@/types'
import { calculateMaxHp } from '@/utils/heroUtils'

/**
 * Sanitize hero stats to fix any NaN values - mutates the hero in place
 * NOTE: Does NOT clamp HP to maxHp because hero.stats.maxHp is the BASE maxHp,
 * while hero.stats.hp can legitimately exceed it due to equipment bonuses.
 * Use calculateTotalStats(hero).maxHp for the effective maxHp when clamping is needed.
 */
export function sanitizeHeroStats(hero: Hero): Hero {
  // Only recalculate maxHp if it's invalid (NaN)
  if (isNaN(hero.stats.maxHp)) {
    const baseMaxHp = calculateMaxHp(hero.level, hero.class.baseStats.defense)
    hero.stats.maxHp = baseMaxHp
  }

  // Only fix HP if it's NaN or negative - DO NOT clamp to maxHp
  // because maxHp is the base value and HP can exceed it with equipment
  if (isNaN(hero.stats.hp) || hero.stats.hp < 0) {
  // Set to base maxHp as a fallback (equipment bonuses will apply on top)
    hero.stats.hp = hero.stats.maxHp
  }

  // Fix any other NaN stats
  if (isNaN(hero.stats.attack)) hero.stats.attack = hero.class.baseStats.attack
  if (isNaN(hero.stats.defense)) hero.stats.defense = hero.class.baseStats.defense
  if (isNaN(hero.stats.speed)) hero.stats.speed = hero.class.baseStats.speed
  if (isNaN(hero.stats.luck)) hero.stats.luck = hero.class.baseStats.luck
  if (hero.stats.magicPower !== undefined && isNaN(hero.stats.magicPower)) {
    hero.stats.magicPower = hero.class.baseStats.magicPower
  }

  // Ensure activeEffects exists
  if (!hero.activeEffects) {
    hero.activeEffects = []
  }

  return hero
}

/**
 * Middleware that sanitizes party state after every mutation AND on subscribe
 */
export const sanitizeMiddleware = <T extends GameState>(config: StateCreator<T>): StateCreator<T> =>
  (set, get, api) => {
    // Subscribe to changes and sanitize on every access
    api.subscribe(() => {
      const state = get() as GameState
      if (state.party?.length > 0) {
        const needsSanitization = state.party.some(hero =>
          hero !== null && (isNaN(hero.stats.hp) || isNaN(hero.stats.maxHp) || !hero.activeEffects)
        )
        if (needsSanitization) {
          set({ party: state.party.map(h => h !== null ? sanitizeHeroStats({ ...h, stats: { ...h.stats }, activeEffects: h.activeEffects || [] }) : null) } as Partial<T>)
        }
      }
    })

    return config(
      (args) => {
        set(args)
        const state = get() as GameState
        if (state.party?.length > 0) {
          const needsSanitization = state.party.some(hero =>
            hero !== null && (isNaN(hero.stats.hp) || isNaN(hero.stats.maxHp) || !hero.activeEffects)
          )
          if (needsSanitization) {
            set({ party: state.party.map(h => h !== null ? sanitizeHeroStats({ ...h, stats: { ...h.stats }, activeEffects: h.activeEffects || [] }) : null) } as Partial<T>)
          }
        }
      },
      get,
      api
    )
  }
