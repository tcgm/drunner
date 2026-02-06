/**
 * Utility actions module
 * Handles utility functions like party repair, stat migration, healing, and game reset
 */

import type { StateCreator } from 'zustand'
import type { GameState, Hero } from '@/types'
import { GAME_CONFIG } from '@/config/gameConfig'
import { calculateStatsWithEquipment } from '@/systems/loot/inventoryManager'
import { getClassById } from '@/data/classes'
import { sanitizeHeroStats } from './middleware'
import { loadRunHistory } from './runHistory'
import { deduplicateGameState } from '@/utils/itemDeduplication'

export interface UtilityActionsSlice {
  repairParty: () => void
  migrateHeroStats: () => void
  recalculateHeroStats: () => void
  healParty: () => void
  resetGame: () => void
  getRunHistory: () => import('@/types').Run[]
  clearRunHistory: () => void
  deduplicateInventories: () => void
}

// We need the initial state from the main gameStore
// This will be passed as a parameter when creating the store
export const createUtilityActions = (initialState: GameState): StateCreator<
  GameState & UtilityActionsSlice,
  [],
  [],
  UtilityActionsSlice
> => (set, get) => ({
  repairParty: () =>
    set((state) => {
      const needsRepair = state.party.some(hero =>
        hero !== null && (isNaN(hero.stats.hp) || isNaN(hero.stats.maxHp))
      )
      if (needsRepair) {
        return { party: state.party.map(h => h !== null ? sanitizeHeroStats({ ...h, stats: { ...h.stats } }) : null) }
      }
      return {}
    }),

  migrateHeroStats: () =>
    set((state) => {
      // Check if any hero actually needs migration
      const allHeroes = [
        ...state.party.filter((h): h is Hero => h !== null),
        ...state.heroRoster
      ]

      const needsMigration = allHeroes.some(hero => {
        const needsWisdom = hero.stats.wisdom == null || isNaN(hero.stats.wisdom)
        const needsCharisma = hero.stats.charisma == null || isNaN(hero.stats.charisma)
        console.log(`[Migration Check] ${hero.name}: wisdom=${hero.stats.wisdom} (${typeof hero.stats.wisdom}), charisma=${hero.stats.charisma} (${typeof hero.stats.charisma}), needsWisdom=${needsWisdom}, needsCharisma=${needsCharisma}`)
        return needsWisdom || needsCharisma
      })

      if (!needsMigration) {
        console.log('[Migration] All heroes already have wisdom/charisma - skipping')
        return {}
      }

      console.log('[Migration] Running wisdom/charisma migration...')
      console.log(`[Migration] Party has ${state.party.filter(h => h !== null).length} heroes`)
      console.log(`[Migration] Roster has ${state.heroRoster.length} heroes`)

      const migrateHero = (hero: Hero): Hero => {
        const needsWisdom = hero.stats.wisdom == null || isNaN(hero.stats.wisdom)
        const needsCharisma = hero.stats.charisma == null || isNaN(hero.stats.charisma)

        if (needsWisdom || needsCharisma) {
          // Get current class definition (in case old hero has outdated class data)
          const currentClass = getClassById(hero.class.id) || hero.class
          const levelBonus = (hero.level - 1) * 5
          console.log(`[Migration] Adding wisdom/charisma to ${hero.name} (${hero.class.name}) Lv${hero.level}`)
          const newWisdom = needsWisdom ? currentClass.baseStats.wisdom + levelBonus : hero.stats.wisdom
          const newCharisma = needsCharisma ? currentClass.baseStats.charisma + levelBonus : hero.stats.charisma
          console.log(`  New values: wisdom=${newWisdom}, charisma=${newCharisma}`)
          return {
            ...hero,
            class: currentClass,
            stats: {
              ...hero.stats,
              wisdom: newWisdom,
              charisma: newCharisma,
            }
          }
        }
        return hero
      }

      const newParty = state.party.map(h => h !== null ? migrateHero(h) : null)
      const newRoster = state.heroRoster.map(h => migrateHero(h))

      console.log('[Migration] Wisdom/charisma migration complete')
      return {
        party: newParty,
        heroRoster: newRoster
      }
    }),

  recalculateHeroStats: () =>
    set((state) => {
      const recalculateHero = (hero: Hero): Hero => {
        const updatedHero = { ...hero }
        updatedHero.stats = calculateStatsWithEquipment(updatedHero)
        return updatedHero
      }

      const newParty = state.party.map(h => h !== null ? recalculateHero(h) : null)
      const newRoster = state.heroRoster.map(h => recalculateHero(h))

      console.log('[Recalculate] Hero stats recalculated with equipment bonuses')
      return {
        party: newParty,
        heroRoster: newRoster
      }
    }),

  healParty: () =>
    set((state) => {
      const healHero = (hero: Hero): Hero => {
        return {
          ...hero,
          stats: {
            ...hero.stats,
            hp: hero.stats.maxHp
          }
        }
      }

      const newParty = state.party.map(h => h !== null ? healHero(h) : null)
      const newRoster = state.heroRoster.map(h => healHero(h))

      return {
        party: newParty,
        heroRoster: newRoster
      }
    }),

  resetGame: () =>
    set(initialState),

  getRunHistory: () => {
    return loadRunHistory()
  },

  clearRunHistory: () => {
    localStorage.removeItem('dungeon-runner-run-history')
    console.log('[RunHistory] Cleared all run history')
  },

  deduplicateInventories: () =>
    set((state) => {
      console.log('[UtilityActions] Running manual inventory deduplication...')
      const dedupeReport = deduplicateGameState(state)

      if (dedupeReport.totalDuplicatesFound > 0) {
        console.warn(`[UtilityActions] Removed ${dedupeReport.totalDuplicatesFound} duplicate items:`, {
          bank: dedupeReport.bankDuplicates,
          dungeon: dedupeReport.dungeonDuplicates,
          heroes: dedupeReport.heroDuplicates
        })
        return state // State was mutated in place by deduplicateGameState
      } else {
        console.log('[UtilityActions] No duplicate items found')
        return {}
      }
    }),
})
