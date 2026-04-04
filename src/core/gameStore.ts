import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GameState, Hero, Item, Equipment } from '@/types'
import type { ItemV3 } from '@/types/items-v3'
import { GAME_CONFIG } from '@/config/gameConfig'
import { needsMigration, CURRENT_SAVE_VERSION } from '@/utils/migration'
import { dehydrateItem, dehydrateItems } from '@/utils/itemHydration'
import LZString from 'lz-string'
import { idbGetWithMigration, idbSet, idbRemove } from '@/utils/idbStorage'
import {
  createBackup,
  sanitizeHeroStats,
  sanitizeMiddleware,
  loadRunHistory,
  saveRunHistory,
  initRunHistoryCache,
  createHeroActions,
  createDungeonActions,
  createInventoryActions,
  createAbilityActions,
  createMusicActions,
  createSaveActions,
  createUtilityActions,
  createQuestActions,
  createHeroBoardActions,
  type HeroActionsSlice,
  type DungeonActionsSlice,
  type InventoryActionsSlice,
  type AbilityActionsSlice,
  type MusicActionsSlice,
  type SaveActionsSlice,
  type UtilityActionsSlice,
  type QuestActionsSlice,
  type HeroBoardActionsSlice,
} from './modules'

interface GameStore extends GameState, 
  HeroActionsSlice,
  DungeonActionsSlice,
  InventoryActionsSlice,
  AbilityActionsSlice,
  MusicActionsSlice,
  SaveActionsSlice,
  UtilityActionsSlice,
  QuestActionsSlice,
  HeroBoardActionsSlice {}

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
  materialStash: {},
  materialChargeProgress: {},
  overflowInventory: [],
  lastRunItems: [],
  corruptedItems: [],
  v2Items: [],
  metaXp: 0,
  nexusUpgrades: {},
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
  quests: [],
  questsLastRefreshed: 0,
  questRunsProcessed: [],
  availableHeroesForHire: [],
  heroBoardLastRefreshed: 0,
  heroBoardCallCooldownUntil: 0,
  hiredUniqueHeroIds: [],
  dismissedUniqueHeroIds: [],
}

/**
 * Dehydrate game state for storage
 * Converts all Item objects to minimal V3 format
 */
function dehydrateGameState(state: GameState): GameState {
  const dehydrateHeroItems = (hero: Hero | null): Hero | null => {
    if (!hero) return hero

    const result = { ...hero } as Hero

    // Handle new slots format (current system)
    if (hero.slots) {
      const dehydratedSlots: Record<string, ItemV3 | null> = {}
      for (const [slotId, item] of Object.entries(hero.slots)) {
        dehydratedSlots[slotId] = item ? dehydrateItem(item) : null
      }
      result.slots = dehydratedSlots as unknown as Hero['slots']
    }

    // Handle legacy equipment format (for backwards compatibility)
    if (hero.equipment) {
      const dehydratedEquipment: Equipment = {
        weapon: hero.equipment.weapon ? dehydrateItem(hero.equipment.weapon) as unknown as Item : null,
        armor: hero.equipment.armor ? dehydrateItem(hero.equipment.armor) as unknown as Item : null,
        helmet: hero.equipment.helmet ? dehydrateItem(hero.equipment.helmet) as unknown as Item : null,
        boots: hero.equipment.boots ? dehydrateItem(hero.equipment.boots) as unknown as Item : null,
        accessory1: hero.equipment.accessory1 ? dehydrateItem(hero.equipment.accessory1) as unknown as Item : null,
        accessory2: hero.equipment.accessory2 ? dehydrateItem(hero.equipment.accessory2) as unknown as Item : null,
      }
      result.equipment = dehydratedEquipment
    }

    return result
  }

  const dehydrated = {
    ...state,
    party: state.party.map(dehydrateHeroItems) as (Hero | null)[],
    heroRoster: state.heroRoster.map(dehydrateHeroItems) as Hero[],
    bankInventory: dehydrateItems(state.bankInventory) as unknown as Item[],
    overflowInventory: dehydrateItems(state.overflowInventory) as unknown as Item[],
    lastRunItems: dehydrateItems(state.lastRunItems ?? []) as unknown as Item[],
    dungeon: {
      ...state.dungeon,
      inventory: dehydrateItems(state.dungeon.inventory) as unknown as Item[],
    },
    // Don't save v2Items - it's regenerated from bank scan on load
  }

  // Ensure critical fields are preserved
  console.log(`[dehydrateGameState] Input - saveVersion: ${state.saveVersion}, alkahest: ${state.alkahest}`)
  console.log(`[dehydrateGameState] Output - saveVersion: ${dehydrated.saveVersion}, alkahest: ${dehydrated.alkahest}`)

  return dehydrated
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
        ...createQuestActions(set, get, api),
        ...createHeroBoardActions(set, get, api),
      })
    ),
    {
      name: 'dungeon-runner-storage',
      storage: {
        getItem: async (name) => {
          console.log(`[GameStore] Loading from storage: ${name}`)
          const compressed = await idbGetWithMigration(name)
          if (!compressed) return null

          // Yield to the browser so React can render before heavy deserialization work
          await new Promise<void>(resolve => setTimeout(resolve, 0))

          // Try to decompress - if it fails, assume it's old uncompressed data
          let str: string
          try {
            str = LZString.decompressFromUTF16(compressed) || compressed
          } catch {
            str = compressed
          }

          try {
            const parsedData = JSON.parse(str)

            // Access the actual nested state
            const actualState = parsedData?.state
            if (!actualState) return parsedData

            // Log critical values immediately after loading
            console.log(`[GameStore] Loaded state - saveVersion: ${actualState.saveVersion}, alkahest: ${actualState.alkahest}, bankGold: ${actualState.bankGold}`)
            console.log(`[GameStore] needsMigration check - CURRENT_SAVE_VERSION: ${CURRENT_SAVE_VERSION}, needs migration: ${needsMigration(actualState)}`)

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

            // corruptedItems / v2Items are populated after render by hydrateLoadedItems()
            actualState.corruptedItems = []
            actualState.v2Items = []

            // Check if migration is needed BEFORE applying it
            // But skip if we're already in pending migration state (to avoid loop)
            if (needsMigration(actualState) && !actualState.pendingMigration) {
              console.log('[Migration] Save file needs migration (saveVersion: ' + actualState.saveVersion + '), setting pending state and prompting user')
              // Return pending state but DON'T save to localStorage yet
              // User must approve first
              // IMPORTANT: Preserve critical fields like alkahest and bankGold from existing save
              return {
                state: {
                  ...initialState,
                  alkahest: actualState.alkahest ?? 0,
                  bankGold: actualState.bankGold ?? 0,
                  pendingMigration: true,
                  pendingMigrationData: compressed, // Store the compressed data for later
                }
              }
            }

            // Reset runtime-only state that should not persist across page loads
            // audioManager is re-initialized fresh every load, so these must be reset
            // to avoid the "already on context" skip-guard blocking playback on startup.
            actualState.currentMusicContext = null

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

            // Log critical values before returning from getItem
            console.log(`[GameStore] Returning state - alkahest: ${state?.state?.alkahest}, bankGold: ${state?.state?.bankGold}`)

            return state
          } catch (error) {
            console.error('Error loading game state:', error)
            return null
          }
        },
        setItem: async (name, value) => {
          // Don't persist to IndexedDB if migration is pending - wait for user approval
          if (value?.state?.pendingMigration) {
            console.log('[Storage] Skipping save - migration pending user approval')
            return
          }

          // Create a backup before overwriting (throttled internally to 5-min intervals)
          await createBackup(name)

          // Log critical values before dehydration
          console.log(`[Storage] Saving - alkahest: ${value?.state?.alkahest}, bankGold: ${value?.state?.bankGold}`)

          // Dehydrate the state to strip computed item data
          const dehydratedValue = {
            ...value,
            state: value.state ? dehydrateGameState(value.state) : value.state
          }

          // Log critical values after dehydration
          console.log(`[Storage] After dehydration - alkahest: ${dehydratedValue?.state?.alkahest}, bankGold: ${dehydratedValue?.state?.bankGold}`)

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

          await idbSet(name, compressed)
        },
        removeItem: async (name) => idbRemove(name),
      },
      onRehydrateStorage: () => {
        // Called after the async getItem promise resolves and state is applied.
        // This is the safe place to run post-load repairs; running them synchronously
        // after store creation would execute on empty initialState since getItem is async.
        return (state, error) => {
          if (error) {
            console.error('[GameStore] Failed to rehydrate:', error)
            return
          }
          if (state) {
            // Initialise run history cache from IndexedDB so sync Zustand
            // actions can call loadRunHistory() without awaiting.
            void initRunHistoryCache()
            state.repairParty()
            state.migrateHeroStats()
            state.recalculateHeroStats()
            state.deduplicateInventories()
            // Hydrate items lazily after render — the heavy per-item work
            // (stat calculation, icon restoration) now runs off the critical path.
            state.hydrateLoadedItems()
          }
        }
      },
    }
  )
)

// HMR cleanup for development
if (import.meta.hot) {
  console.log('[GameStore] HMR handler registered')
  import.meta.hot.dispose(async () => {
    console.log('[GameStore] HMR: Disposing - clearing item hydration cache to prevent corruption')
    // Clear the item hydration cache to force icon restoration on next render
    try {
      const { clearItemCache } = await import('@/utils/itemHydration')
      clearItemCache()
      console.log('[GameStore] HMR: Item cache cleared successfully')
    } catch (e) {
      console.error('[GameStore] HMR: Failed to clear cache:', e)
    }
  })
}
