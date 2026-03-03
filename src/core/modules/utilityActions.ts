/**
 * Utility actions module
 * Handles utility functions like party repair, stat migration, healing, and game reset
 */

import type { StateCreator } from 'zustand'
import type { GameState, Hero, Item, ItemStorage, Equipment } from '@/types'
import { hydrateItemsWithDetails, hydrateItemsWithCorrupted } from '@/utils/itemHydration'
import { GAME_CONFIG } from '@/config/gameConfig'
import { calculateStatsWithEquipment } from '@/systems/loot/inventoryManager'
import { calculateTotalStats } from '@/utils/statCalculator'
import { getClassById } from '@/data/classes'
import { sanitizeHeroStats } from './middleware'
import { loadRunHistory } from './runHistory'
import { deduplicateGameState } from '@/utils/itemDeduplication'
import { NEXUS_UPGRADES, getNextTierCost, setActiveNexusUpgrades } from '@/data/nexus'

export interface UtilityActionsSlice {
  repairParty: () => void
  migrateHeroStats: () => void
  recalculateHeroStats: () => void
  healParty: () => void
  resetGame: () => void
  getRunHistory: () => import('@/types').Run[]
  clearRunHistory: () => void
  deduplicateInventories: () => void
  hydrateLoadedItems: () => void
  /** Purchase the next tier of a Nexus upgrade. Returns true on success. */
  purchaseNexusUpgrade: (upgradeId: string) => boolean
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
        // Always re-attach the live class definition so new fields (e.g. primaryStats)
        // added after a save was created are available without a full migration pass.
        const liveClass = getClassById(hero.class.id)
        const updatedHero = liveClass ? { ...hero, class: liveClass } : { ...hero }
        updatedHero.stats = calculateStatsWithEquipment(updatedHero)
        return updatedHero
      }

      const newParty = state.party.map(h => h !== null ? recalculateHero(h) : null)
      const newRoster = state.heroRoster.map(h => recalculateHero(h))

      console.log('[Recalculate] Hero stats recalculated with equipment bonuses (class definitions refreshed)')
      return {
        party: newParty,
        heroRoster: newRoster
      }
    }),

  healParty: () =>
    set((state) => {
      const healHero = (hero: Hero): Hero => {
        // Heal to effective maxHp (including equipment bonuses)
        const effectiveMaxHp = calculateTotalStats(hero).maxHp
        return {
          ...hero,
          stats: {
            ...hero.stats,
            hp: effectiveMaxHp
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

  hydrateLoadedItems: () => {
    const state = get()
    console.log('[HydrateItems] Starting lazy item hydration after render...')

    const allCorrupted: Item[] = []
    const allV2: Item[] = []

    // Hydrate flat inventories
    let bankInventory = state.bankInventory
    let dungeonInventory = state.dungeon.inventory
    let overflowInventory = state.overflowInventory
    let lastRunItems = state.lastRunItems ?? []

    if (bankInventory?.length > 0) {
      console.log(`[HydrateItems] Hydrating ${bankInventory.length} bank items`)
      const { valid, corrupted, v2 } = hydrateItemsWithDetails(bankInventory as ItemStorage[])
      console.log(`[HydrateItems] Bank result: ${valid.length} valid, ${corrupted.length} corrupted, ${v2.length} V2`)
      bankInventory = valid
      allCorrupted.push(...corrupted)
      allV2.push(...v2)
    }
    if (dungeonInventory?.length > 0) {
      const { valid, corrupted } = hydrateItemsWithCorrupted(dungeonInventory as ItemStorage[])
      dungeonInventory = valid
      allCorrupted.push(...corrupted)
    }
    if (overflowInventory?.length > 0) {
      const { valid, corrupted } = hydrateItemsWithCorrupted(overflowInventory as ItemStorage[])
      overflowInventory = valid
      allCorrupted.push(...corrupted)
    }
    if (lastRunItems?.length > 0) {
      const { valid } = hydrateItemsWithCorrupted(lastRunItems as ItemStorage[])
      lastRunItems = valid
    }

    // Helper to hydrate equipped items on a hero
    const hydrateHeroItems = (hero: Hero): Hero => {
      if (hero.slots) {
        const newSlots = { ...hero.slots }
        for (const slotId in newSlots) {
          if (newSlots[slotId] !== null) {
            const { valid, corrupted } = hydrateItemsWithCorrupted([newSlots[slotId] as ItemStorage])
            newSlots[slotId] = valid[0] || null
            allCorrupted.push(...corrupted)
          }
        }
        return { ...hero, slots: newSlots }
      }
      const equippedItems = Object.values(hero.equipment || {}).filter((item): item is Item => item !== null)
      if (equippedItems.length > 0) {
        const { valid, corrupted } = hydrateItemsWithCorrupted(equippedItems as ItemStorage[])
        allCorrupted.push(...corrupted)
        const newEquipment = { ...hero.equipment } as Equipment
        let itemIndex = 0
        Object.keys(newEquipment).forEach((slot) => {
          const key = slot as keyof Equipment
          if (newEquipment[key] !== null) {
            newEquipment[key] = valid[itemIndex] || null
            itemIndex++
          }
        })
        return { ...hero, equipment: newEquipment }
      }
      return hero
    }

    let party = state.party.map((h) => h ? hydrateHeroItems(h) : null)
    let heroRoster = state.heroRoster.map(hydrateHeroItems)

    // Sync roster <-> party: ensures both sides have the most complete hero data.
    // Party data is the source of truth for active heroes, but roster wins on level/items.
    const validPartyHeroes = party.filter((h): h is Hero => h !== null)
    validPartyHeroes.forEach((partyHero) => {
      const rosterIndex = heroRoster.findIndex((h) => h.id === partyHero.id)
      if (rosterIndex !== -1) {
        const rosterHero = heroRoster[rosterIndex]
        const partyHasItems = partyHero.slots
          ? Object.values(partyHero.slots).some(item => item !== null)
          : Object.values(partyHero.equipment || {}).some(item => item !== null)
        const rosterHasItems = rosterHero.slots
          ? Object.values(rosterHero.slots).some(item => item !== null)
          : Object.values(rosterHero.equipment || {}).some(item => item !== null)
        const shouldUseParty =
          partyHero.level > rosterHero.level ||
          (partyHero.level === rosterHero.level && partyHasItems && !rosterHasItems)
        const shouldUseRoster =
          rosterHero.level > partyHero.level ||
          (rosterHero.level === partyHero.level && rosterHasItems && !partyHasItems)
        if (shouldUseParty) {
          heroRoster = heroRoster.map((h, i) => i === rosterIndex ? { ...partyHero } : h)
          console.log(`[HydrateItems] Synced roster hero ${partyHero.name} from party`)
        } else if (shouldUseRoster) {
          const partySlot = party.findIndex((h) => h?.id === rosterHero.id)
          if (partySlot !== -1) {
            party = party.map((h, i) => i === partySlot ? { ...rosterHero } : h)
            console.log(`[HydrateItems] Synced party hero ${rosterHero.name} from roster`)
          }
        }
      } else {
        // Hero in party but missing from roster — add them
        heroRoster = [...heroRoster, { ...partyHero }]
        console.log(`[HydrateItems] Added missing hero ${partyHero.name} to roster`)
      }
    })

    if (allV2.length > 0) {
      console.log(`[HydrateItems] Found ${allV2.length} V2 items that can be migrated`)
    }
    if (allCorrupted.length > 0) {
      console.warn(`[HydrateItems] Found ${allCorrupted.length} corrupted items`)
      allCorrupted.forEach((item, index) => {
        console.log(`[Corrupted ${index + 1}]`, {
          id: item.id, name: item.name, type: item.type, rarity: item.rarity,
          hasStats: Object.keys(item.stats || {}).length > 0
        })
      })
    }

    console.log('[HydrateItems] Lazy item hydration complete')
    set({
      bankInventory,
      dungeon: { ...state.dungeon, inventory: dungeonInventory },
      overflowInventory,
      lastRunItems,
      party,
      heroRoster,
      corruptedItems: allCorrupted,
      v2Items: allV2,
    })
  },

  purchaseNexusUpgrade: (upgradeId: string): boolean => {
    const state = get()
    const cost = getNextTierCost(upgradeId, state.nexusUpgrades ?? {})
    if (cost === null) return false // already at max tier
    if (state.metaXp < cost) return false // insufficient Meta XP

    const upgrade = NEXUS_UPGRADES.find(u => u.id === upgradeId)
    if (!upgrade) return false

    const currentTier = (state.nexusUpgrades ?? {})[upgradeId] ?? 0
    const newNexusUpgrades = { ...(state.nexusUpgrades ?? {}), [upgradeId]: currentTier + 1 }
    set({
      metaXp: state.metaXp - cost,
      nexusUpgrades: newNexusUpgrades,
    })
    // Keep the module-level context in sync for game systems
    setActiveNexusUpgrades(newNexusUpgrades)
    return true
  },
})
