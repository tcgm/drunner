/**
 * Ability actions module
 * Handles hero ability usage
 */

import type { StateCreator } from 'zustand'
import type { GameState, Hero } from '@/types'
import { useAbility as applyAbility } from '@/systems/abilities/abilityManager'

export interface AbilityActionsSlice {
  useAbility: (heroId: string, abilityId: string) => { success: boolean; message: string }
}

export const createAbilityActions: StateCreator<
  GameState & AbilityActionsSlice,
  [],
  [],
  AbilityActionsSlice
> = (set, get) => ({
  useAbility: (heroId, abilityId) => {
    const state = get()
    const hero = state.party.find(h => h?.id === heroId)

    if (!hero) {
      return { success: false, message: 'Hero not found' }
    }

    // Use the current floor for cooldown tracking
    const result = applyAbility(hero, abilityId, state.dungeon.floor, state.party)

    if (result.success) {
      // Update the hero and party state
      set({
        party: state.party.map(h => {
          if (!h) return null
          const updatedHero = result.party.find(ph => ph?.id === h.id)
          return updatedHero || h
        }),
        heroRoster: state.heroRoster.map(h => {
          const updatedHero = result.party.find(ph => ph?.id === h.id) as Hero | undefined
          return updatedHero || h
        })
      })
    }

    return { success: result.success, message: result.message }
  },
})
