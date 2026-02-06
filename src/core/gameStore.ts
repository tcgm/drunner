import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GameState, Hero, Run, Item, ItemStorage, Equipment } from '@/types'
import { MusicContext } from '@/types/audio'
import { GAME_CONFIG } from '@/config/gameConfig'
import { needsMigration, CURRENT_SAVE_VERSION } from '@/utils/migration'
import { hydrateItem, hydrateItems, hydrateItemsWithCorrupted, hydrateItemsWithDetails, dehydrateItem, dehydrateItems } from '@/utils/itemHydration'
import LZString from 'lz-string'
import { calculateMaxHp } from '@/utils/heroUtils'
import { loadSave, applyMigratedState } from '@/core/saveManager'
import {
  createBackup,
  sanitizeHeroStats,
  sanitizeMiddleware,
  loadRunHistory,
  saveRunHistory,
  createHeroActions,
  createDungeonActions,
  createInventoryActions,
  createAbilityActions,
  createMusicActions,
  createSaveActions,
  createUtilityActions,
  type HeroActionsSlice,
  type DungeonActionsSlice,
  type InventoryActionsSlice,
  type AbilityActionsSlice,
  type MusicActionsSlice,
  type SaveActionsSlice,
  type UtilityActionsSlice,
} from './modules'

interface GameStore extends GameState, 
  HeroActionsSlice,
  DungeonActionsSlice,
  InventoryActionsSlice,
  AbilityActionsSlice,
  MusicActionsSlice,
  SaveActionsSlice,
  UtilityActionsSlice {}

const initialState: GameState = {
  saveVersion: CURRENT_SAVE_VERSION,
  party: Array(GAME_CONFIG.party.maxSize).fill(null),
  heroRoster: [],
  dungeon: {
    depth: 0,
    floor: 0,
    eventsThisFloor: 0,
    eventsRequiredThisFloor: 4,
    currentEvent: null,
    eventHistory: [],
    eventLog: [],
    gold: 0,
    inventory: [],
    isNextEventBoss: false,
    bossType: null,
  },
  bankGold: 0,
  alkahest: 0,
  bankInventory: [],
  bankStorageSlots: GAME_CONFIG.bank.startingSlots,
  overflowInventory: [],
  corruptedItems: [],
  v2Items: [],
  metaXp: 0,
  isGameOver: false,
  isPaused: false,
  hasPendingPenalty: false,
  activeRun: null,
  runHistory: [],
  lastOutcome: null,
  musicVolume: 0.7,
  musicEnabled: true,
  currentMusicContext: null,
  pendingMigration: false,
  pendingMigrationData: null,
}

/**
 * Dehydrate game state for storage
 * Converts all Item objects to minimal V3 format
 */
function dehydrateGameState(state: GameState): GameState {
  const dehydrateHeroItems = (hero: Hero | null): Hero | null => {
    if (!hero || !hero.equipment) return hero

    const dehydratedEquipment: Equipment = {
      weapon: hero.equipment.weapon ? dehydrateItem(hero.equipment.weapon) as any : null,
      armor: hero.equipment.armor ? dehydrateItem(hero.equipment.armor) as any : null,
      helmet: hero.equipment.helmet ? dehydrateItem(hero.equipment.helmet) as any : null,
      boots: hero.equipment.boots ? dehydrateItem(hero.equipment.boots) as any : null,
      accessory1: hero.equipment.accessory1 ? dehydrateItem(hero.equipment.accessory1) as any : null,
      accessory2: hero.equipment.accessory2 ? dehydrateItem(hero.equipment.accessory2) as any : null,
    }

    return {
      ...hero,
      equipment: dehydratedEquipment,
    }
  }

  return {
    ...state,
    party: state.party.map(dehydrateHeroItems) as (Hero | null)[],
    heroRoster: state.heroRoster.map(dehydrateHeroItems) as Hero[],
    bankInventory: dehydrateItems(state.bankInventory) as any,
    overflowInventory: dehydrateItems(state.overflowInventory) as any,
    // Don't save v2Items - it's regenerated from bank scan on load
  }
}

export const useGameStore = create<GameStore>()(
  persist(
    sanitizeMiddleware(
      (set, get, api) => ({
        ...initialState,
        ...createHeroActions(set, get, api),
        ...createDungeonActions(set, get, api),
        ...createInventoryActions(set, get, api),
        ...createAbilityActions(set, get, api),
        ...createMusicActions(set, get, api),
        ...createSaveActions(set, get, api),
        ...createUtilityActions(initialState)(set, get, api),
      })
    ),
    {
      name: 'dungeon-runner-storage',
      storage: {
        getItem: (name) => {
          console.log(`[GameStore] Loading from storage: ${name}`)
          const compressed = localStorage.getItem(name)
          if (!compressed) return null

          // Try to decompress - if it fails, assume it's old uncompressed data
          let str: string
          try {
            str = LZString.decompressFromUTF16(compressed) || compressed
          } catch {
            str = compressed
          }

          // Create backup before attempting repair
          createBackup(name)

          try {
            const parsedData = JSON.parse(str)

            // Access the actual nested state
            const actualState = parsedData?.state
            if (!actualState) return parsedData

            // Recovery: Fix negative alkahest by converting to positive
            if (actualState.alkahest !== undefined && actualState.alkahest < 0) {
              console.warn(`[GameStore] Detected negative alkahest: ${actualState.alkahest}, converting to positive`)
              actualState.alkahest = Math.abs(actualState.alkahest)
            }

            // Repair party array size if it doesn't match config
            if (actualState.party) {
              const expectedSize = GAME_CONFIG.party.maxSize
              if (!Array.isArray(actualState.party) || actualState.party.length !== expectedSize) {
                // Create new array with correct size
                const newParty = Array(expectedSize).fill(null)
                // Copy existing heroes to new array
                if (Array.isArray(actualState.party)) {
                  actualState.party.forEach((hero: Hero | null, index: number) => {
                    if (index < expectedSize && hero !== null) {
                      newParty[index] = hero
                    }
                  })
                }
                actualState.party = newParty
              }
            } else {
              // If party is missing entirely, initialize it
              actualState.party = Array(GAME_CONFIG.party.maxSize).fill(null)
            }

            // Repair any NaN values when loading from storage
            if (actualState.party?.length > 0) {
              actualState.party = actualState.party.map((h: Hero | null) => {
                if (!h) return null
                if (isNaN(h.stats?.hp) || isNaN(h.stats?.maxHp)) {
                  return sanitizeHeroStats({ ...h, stats: { ...h.stats } })
                }
                return h
              })
            }

            // Also repair heroRoster
            if (actualState.heroRoster?.length > 0) {
              actualState.heroRoster = actualState.heroRoster.map((h: Hero) => {
                if (isNaN(h.stats?.hp) || isNaN(h.stats?.maxHp)) {
                  return sanitizeHeroStats({ ...h, stats: { ...h.stats } })
                }
                return h
              })
            }

            // Hydrate and repair item names/icons in inventories
            // Collect corrupted items that need user resolution
            const allCorrupted: Item[] = []
            const allV2: Item[] = []

            console.log(`[GameStore] bankInventory: ${actualState.bankInventory?.length || 0} items`)
            if (actualState.bankInventory?.length > 0) {
              console.log(`[GameStore] Hydrating ${actualState.bankInventory.length} bank items`)
              const { valid, corrupted, v2 } = hydrateItemsWithDetails(actualState.bankInventory as ItemStorage[])
              console.log(`[GameStore] Bank result: ${valid.length} valid, ${corrupted.length} corrupted, ${v2.length} V2`)
              actualState.bankInventory = valid
              allCorrupted.push(...corrupted)
              allV2.push(...v2)
            }
            if (actualState.dungeon?.inventory?.length > 0) {
              const { valid, corrupted } = hydrateItemsWithCorrupted(actualState.dungeon.inventory as ItemStorage[])
              actualState.dungeon.inventory = valid
              allCorrupted.push(...corrupted)
            }
            if (actualState.overflowInventory?.length > 0) {
              const { valid, corrupted } = hydrateItemsWithCorrupted(actualState.overflowInventory as ItemStorage[])
              actualState.overflowInventory = valid
              allCorrupted.push(...corrupted)
            }

            // Hydrate equipped items on heroes in party
            if (actualState.party?.length > 0) {
              actualState.party = actualState.party.map((hero: Hero | null) => {
                if (!hero) return null

                // Handle new slot format
                if (hero.slots) {
                  const newSlots = { ...hero.slots }
                  for (const slotId in newSlots) {
                    if (newSlots[slotId] !== null && 'stats' in newSlots[slotId]!) {
                      const { valid, corrupted } = hydrateItemsWithCorrupted([newSlots[slotId] as ItemStorage])
                      newSlots[slotId] = valid[0] || null
                      allCorrupted.push(...corrupted)
                    }
                  }
                  return { ...hero, slots: newSlots }
                }

                // Handle old equipment format (for backwards compatibility)
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
              })
            }

            // Sync roster from party if roster heroes are corrupted
            // Party data is the source of truth for active heroes
            if (actualState.party && actualState.heroRoster) {
              const validPartyHeroes = actualState.party.filter((h: Hero | null): h is Hero => h !== null)

              // For each hero in party, check if roster version is outdated or corrupted
              validPartyHeroes.forEach((partyHero: Hero) => {
                const rosterIndex = actualState.heroRoster.findIndex((h: Hero) => h.id === partyHero.id)

                if (rosterIndex !== -1) {
                  const rosterHero = actualState.heroRoster[rosterIndex]

                  // Check corruption using both old equipment and new slots format
                  const partyHasItems = partyHero.slots
                    ? Object.values(partyHero.slots).some(item => item !== null)
                    : Object.values(partyHero.equipment || {}).some(item => item !== null)

                  const rosterHasItems = rosterHero.slots
                    ? Object.values(rosterHero.slots).some(item => item !== null)
                    : Object.values(rosterHero.equipment || {}).some(item => item !== null)

                  // Determine which version has the most complete data
                  // Priority: higher level > has items > neither (use party as source of truth)
                  const shouldUseParty = (
                    partyHero.level > rosterHero.level
                  ) || (
                      partyHero.level === rosterHero.level && partyHasItems && !rosterHasItems
                    )

                  const shouldUseRoster = (
                    rosterHero.level > partyHero.level
                  ) || (
                      rosterHero.level === rosterHero.level && rosterHasItems && !partyHasItems
                    )

                  if (shouldUseParty) {
                    // Party has better data, sync roster from party
                    actualState.heroRoster[rosterIndex] = { ...partyHero }
                    console.log(`[Repair] Synced roster hero ${partyHero.name} from party (level ${partyHero.level}, items: ${partyHasItems})`)
                  } else if (shouldUseRoster) {
                    // Roster has better data, sync party from roster (this prevents item loss!)
                    const partySlotIndex = actualState.party.findIndex((h: Hero | null) => h?.id === rosterHero.id)
                    if (partySlotIndex !== -1) {
                      actualState.party[partySlotIndex] = { ...rosterHero }
                      console.log(`[Repair] Synced party hero ${rosterHero.name} from roster (level ${rosterHero.level}, items: ${rosterHasItems})`)
                    }
                  }
                } else {
                  // Hero in party but not in roster, add them
                  actualState.heroRoster.push({ ...partyHero })
                  console.log(`[Repair] Added missing hero ${partyHero.name} to roster`)
                }
              })
            }

            // Repair equipped items on heroes in roster
            if (actualState.heroRoster?.length > 0) {
              actualState.heroRoster = actualState.heroRoster.map((hero: Hero) => {
                // Handle new slot format
                if (hero.slots) {
                  const newSlots = { ...hero.slots }
                  for (const slotId in newSlots) {
                    if (newSlots[slotId] !== null && 'stats' in newSlots[slotId]!) {
                      const { valid, corrupted } = hydrateItemsWithCorrupted([newSlots[slotId] as ItemStorage])
                      newSlots[slotId] = valid[0] || null
                      allCorrupted.push(...corrupted)
                    }
                  }
                  return { ...hero, slots: newSlots }
                }

                // Handle old equipment format (for backwards compatibility)
                const equippedItems = Object.values(hero.equipment || {}).filter((item): item is Item => item !== null)
                if (equippedItems.length > 0) {
                  const { valid, corrupted } = hydrateItemsWithCorrupted(equippedItems as ItemStorage[])
                  allCorrupted.push(...corrupted)
                  const hydratedItems = valid
                  const newEquipment = { ...hero.equipment } as Equipment
                  let itemIndex = 0
                  Object.keys(newEquipment).forEach((slot) => {
                    const key = slot as keyof Equipment
                    if (newEquipment[key] !== null) {
                      newEquipment[key] = hydratedItems[itemIndex] || null
                      itemIndex++
                    }
                  })
                  return { ...hero, equipment: newEquipment }
                }
                return hero
              })
            }

            // Update corrupted items with all collected corrupted items
            actualState.corruptedItems = allCorrupted

            // Always regenerate v2Items from fresh scan
            // Converted items should not appear in allV2 since they have proper metadata
            actualState.v2Items = allV2

            if (allV2.length > 0) {
              console.log(`[GameStore] Found ${allV2.length} V2 format items that can be migrated`)
            }

            if (allCorrupted.length > 0) {
              console.warn(`[GameStore] Found ${allCorrupted.length} corrupted items`)
              allCorrupted.forEach((item, index) => {
                console.log(`[Corrupted ${index + 1}]`, {
                  id: item.id,
                  name: item.name,
                  type: item.type,
                  rarity: item.rarity,
                  hasStats: Object.keys(item.stats || {}).length > 0
                })
              })
            }

            // Check if migration is needed BEFORE applying it
            // But skip if we're already in pending migration state (to avoid loop)
            if (needsMigration(actualState) && !actualState.pendingMigration) {
              console.log('[Migration] Save file needs migration, setting pending state and prompting user')
              // Return pending state but DON'T save to localStorage yet
              // User must approve first
              return {
                state: {
                  ...initialState,
                  pendingMigration: true,
                  pendingMigrationData: compressed, // Store the compressed data for later
                }
              }
            }

            // If already in pending migration state, just return it
            if (actualState.pendingMigration) {
              console.log('[Migration] Already in pending migration state')
              return { state: actualState }
            }

            // Migration already applied by loadSave
            const migratedState = actualState
            const state = { state: migratedState }

            // Migrate run history to separate storage if it exists
            if (migratedState.runHistory && migratedState.runHistory.length > 0) {
              console.log(`[RunHistory Migration] Found ${migratedState.runHistory.length} runs in old save, migrating to separate storage`)
              const existingHistory = loadRunHistory()

              // Merge old and new, deduplicate by run ID
              const allRuns = [...migratedState.runHistory, ...existingHistory]
              const uniqueRuns = allRuns.filter((run, index, self) =>
                index === self.findIndex(r => r.id === run.id)
              )

              saveRunHistory(uniqueRuns)
              console.log(`[RunHistory Migration] Saved ${uniqueRuns.length} total runs`)

              // Clear from main state
              migratedState.runHistory = []
            }

            // Save the state immediately after hydration to persist any icon/baseTemplateId fixes
            // Do this silently without going through setItem to avoid triggering backups on every load
            const replacer = (key: string, val: unknown) => {
              if (key === 'icon' && typeof val === 'function') {
                return undefined
              }
              return val
            }
            const json = JSON.stringify(state, replacer)
            const compressedOutput = LZString.compressToUTF16(json)
            localStorage.setItem(name, compressedOutput)

            return state
          } catch (error) {
            console.error('Error loading game state:', error)
            return null
          }
        },
        setItem: (name, value) => {
          // Don't persist to localStorage if migration is pending - wait for user approval
          if (value?.state?.pendingMigration) {
            console.log('[Storage] Skipping save - migration pending user approval')
            return
          }

          // Dehydrate the state to strip computed item data
          const dehydratedValue = {
            ...value,
            state: value.state ? dehydrateGameState(value.state) : value.state
          }

          // Custom replacer to strip out icon functions that shouldn't be serialized
          const replacer = (key: string, val: unknown) => {
            // Skip icon functions
            if (key === 'icon' && typeof val === 'function') {
              return undefined
            }
            return val
          }
          const json = JSON.stringify(dehydratedValue, replacer)

          // Compress the JSON before saving
          const compressed = LZString.compressToUTF16(json)
          const originalSize = new Blob([json]).size
          const compressedSize = new Blob([compressed]).size
          console.log(`[Storage] Compressed save: ${(originalSize / 1024).toFixed(2)} KB → ${(compressedSize / 1024).toFixed(2)} KB (${((1 - compressedSize / originalSize) * 100).toFixed(1)}% reduction)`)

          localStorage.setItem(name, compressed)
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
)

// Repair party on initial mount
useGameStore.getState().repairParty()
// Migrate hero stats to add wisdom and charisma
useGameStore.getState().migrateHeroStats()
// Recalculate hero stats to ensure equipment bonuses are applied
useGameStore.getState().recalculateHeroStats()
// Deduplicate any duplicate items in inventories
useGameStore.getState().deduplicateInventories()
