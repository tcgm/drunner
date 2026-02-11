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
      // result.hero has the updated abilities with cooldowns
      // result.party has the updated party with healing/buff effects
      set({
        party: state.party.map(h => {
          if (!h) return null
          // Find the updated version from result.party (has healing effects)
          const partyUpdate = result.party.find(ph => ph?.id === h.id)
          // If this is the caster, use result.hero which has updated abilities
          if (h.id === hero.id) {
            return result.hero
          }
          return partyUpdate || h
        }),
        heroRoster: state.heroRoster.map(h => {
          // Find the updated version from result.party
          const partyUpdate = result.party.find(ph => ph?.id === h.id) as Hero | undefined
          // If this is the caster, use result.hero which has updated abilities
          if (h.id === hero.id) {
            return result.hero
          }
          return partyUpdate || h
        })
      })
    }

    return { success: result.success, message: result.message }
  },
})
