/**
 * Hero actions module
 * Handles hero management operations (add, remove, update)
 */

import type { StateCreator } from 'zustand'
import type { GameState, Hero } from '@/types'
import { createHero } from '@/utils/heroUtils'
import { calculateTotalStats } from '@/utils/statCalculator'

export interface HeroActionsSlice {
  addHero: (hero: Hero, slotIndex?: number) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addHeroByClass: (heroClass: any, slotIndex?: number) => void
  removeHero: (heroId: string) => void
  updateHero: (heroId: string, updates: Partial<Hero>) => void
}

export const createHeroActions: StateCreator<
  GameState & HeroActionsSlice,
  [],
  [],
  HeroActionsSlice
> = (set) => ({
  addHero: (hero, slotIndex) =>
    set((state) => {
      // If no slot specified, find first empty slot
      const targetIndex = slotIndex !== undefined ? slotIndex : state.party.findIndex(h => h === null)
      if (targetIndex === -1 || targetIndex >= state.party.length) return state // Party full or invalid slot
      if (state.party[targetIndex] !== null) return state // Slot occupied

      // Heal hero to full HP (using effective max HP with equipment)
      const effectiveMaxHp = calculateTotalStats(hero).maxHp
      const healedHero = { ...hero, stats: { ...hero.stats, hp: effectiveMaxHp } }

      // Add to roster if not already there
      const existingInRoster = state.heroRoster.find(h => h.id === hero.id)
      const newParty = [...state.party]
      newParty[targetIndex] = healedHero

      // Also update in roster if exists
      const updatedRoster = existingInRoster
        ? state.heroRoster.map(h => h.id === hero.id ? healedHero : h)
        : [...state.heroRoster, healedHero]

      return {
        party: newParty,
        heroRoster: updatedRoster
      }
    }),

  addHeroByClass: (heroClass, slotIndex) =>
    set((state) => {
      // If no slot specified, find first empty slot
      const targetIndex = slotIndex !== undefined ? slotIndex : state.party.findIndex(h => h === null)
      if (targetIndex === -1 || targetIndex >= state.party.length) return state // Party full or invalid slot
      if (state.party[targetIndex] !== null) return state // Slot occupied

      // Find existing hero of this class in roster that's not currently in party
      const existingHero = state.heroRoster.find(
        h => h.class.id === heroClass.id && !state.party.some(p => p !== null && p.id === h.id)
      )

      const newParty = [...state.party]

      if (existingHero) {
        // Reuse existing hero and heal to full HP (using effective max HP with equipment)
        const effectiveMaxHp = calculateTotalStats(existingHero).maxHp
        const healedHero = { ...existingHero, stats: { ...existingHero.stats, hp: effectiveMaxHp } }
        newParty[targetIndex] = healedHero

        // Also update in roster
        const updatedRoster = state.heroRoster.map(h => h.id === existingHero.id ? healedHero : h)

        return {
          party: newParty,
          heroRoster: updatedRoster
        }
      } else {
        // Create new hero
        const newHero = createHero(heroClass, heroClass.name)
        newParty[targetIndex] = newHero
        return {
          party: newParty,
          heroRoster: [...state.heroRoster, newHero]
        }
      }
    }),

  removeHero: (heroId) =>
    set((state) => {
      const newParty = state.party.map(h => h?.id === heroId ? null : h)
      return { party: newParty }
    }),

  updateHero: (heroId, updates) =>
    set((state) => {
      const updatedParty = state.party.map(h =>
        h?.id === heroId ? { ...h, ...updates } : h
      )
      const updatedRoster = state.heroRoster.map(h =>
        h.id === heroId ? { ...h, ...updates } : h
      )
      return {
        party: updatedParty,
        heroRoster: updatedRoster
      }
    }),
})
