/**
 * Middleware module
 * Contains Zustand middleware for sanitizing game state
 */

import type { StateCreator } from 'zustand'
import type { GameState, Hero } from '@/types'
import { calculateMaxHp } from '@/utils/heroUtils'

/**
 * Sanitize hero stats to fix any NaN values - mutates the hero in place
 */
export function sanitizeHeroStats(hero: Hero): Hero {
  const maxHp = calculateMaxHp(hero.level, hero.class.baseStats.defense)

  if (isNaN(hero.stats.hp) || isNaN(hero.stats.maxHp)) {
    hero.stats.maxHp = maxHp
    hero.stats.hp = isNaN(hero.stats.hp) ? maxHp : Math.min(hero.stats.hp, maxHp)
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
