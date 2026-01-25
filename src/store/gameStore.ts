import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { StateCreator } from 'zustand'
import type { GameState, Hero, EventChoice, Item, ItemSlot } from '@/types'
import { getNextEvent } from '@systems/events/eventSelector'
import { resolveEventOutcome } from '@systems/events/eventResolver'
import { GAME_CONFIG } from '@/config/game'
import { calculateMaxHp, createHero } from '@/utils/heroUtils'
import { equipItem, unequipItem, sellItem } from '@/systems/loot/inventoryManager'

/**
 * Sanitize hero stats to fix any NaN values - mutates the hero in place
 */
function sanitizeHeroStats(hero: Hero): Hero {
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
  
  return hero
}

/**
 * Middleware that sanitizes party state after every mutation AND on subscribe
 */
const sanitizeMiddleware = <T extends GameState>(config: StateCreator<T>): StateCreator<T> =>
  (set, get, api) => {
    // Subscribe to changes and sanitize on every access
    api.subscribe(() => {
      const state = get() as GameState
      if (state.party?.length > 0) {
        const needsSanitization = state.party.some(hero => 
          isNaN(hero.stats.hp) || isNaN(hero.stats.maxHp)
        )
        if (needsSanitization) {
          set({ party: state.party.map(h => sanitizeHeroStats({ ...h, stats: { ...h.stats } })) } as Partial<T>, true)
        }
      }
    })

    return config(
      (args) => {
        set(args)
        const state = get() as GameState
        if (state.party?.length > 0) {
          const needsSanitization = state.party.some(hero => 
            isNaN(hero.stats.hp) || isNaN(hero.stats.maxHp)
          )
          if (needsSanitization) {
            set({ party: state.party.map(h => sanitizeHeroStats({ ...h, stats: { ...h.stats } })) } as Partial<T>)
          }
        }
      },
      get,
      api
    )
  }

/**
 * Apply death penalty to a party of heroes
 */
function applyPenaltyToParty(party: Hero[]): Hero[] {
  return party.map(hero => {
    const newHero = { ...hero }
    
    switch (GAME_CONFIG.deathPenalty.type) {
      case 'halve-levels':
        // Halve level (min 1)
        newHero.level = Math.max(1, Math.floor(hero.level / 2))
        newHero.xp = 0
        // Recalculate stats based on new level
        const levelDifference = hero.level - newHero.level
        newHero.stats = { ...hero.stats }
        newHero.stats.attack = Math.max(hero.class.baseStats.attack, hero.stats.attack - (levelDifference * GAME_CONFIG.statGains.attack))
        newHero.stats.defense = Math.max(hero.class.baseStats.defense, hero.stats.defense - (levelDifference * GAME_CONFIG.statGains.defense))
        newHero.stats.speed = Math.max(hero.class.baseStats.speed, hero.stats.speed - (levelDifference * GAME_CONFIG.statGains.speed))
        newHero.stats.luck = Math.max(hero.class.baseStats.luck, hero.stats.luck - (levelDifference * GAME_CONFIG.statGains.luck))
        newHero.stats.maxHp = calculateMaxHp(newHero.level, hero.class.baseStats.defense)
        newHero.stats.hp = newHero.stats.maxHp
        break
        
      case 'reset-levels':
        // Reset to level 1
        newHero.level = 1
        newHero.xp = 0
        newHero.stats = {
          hp: calculateMaxHp(1, hero.class.baseStats.defense),
          maxHp: calculateMaxHp(1, hero.class.baseStats.defense),
          attack: hero.class.baseStats.attack,
          defense: hero.class.baseStats.defense,
          speed: hero.class.baseStats.speed,
          luck: hero.class.baseStats.luck,
          magicPower: hero.class.baseStats.magicPower,
        }
        break
        
      case 'lose-equipment':
        // Keep levels but reset equipment
        newHero.equipment = {
          weapon: null,
          armor: null,
          helmet: null,
          boots: null,
          accessory1: null,
          accessory2: null,
        }
        newHero.stats = { ...hero.stats }
        newHero.stats.hp = newHero.stats.maxHp
        break
        
      case 'none':
      default:
        // Just revive with full HP
        newHero.stats = { ...hero.stats }
        newHero.stats.hp = newHero.stats.maxHp
        break
    }
    
    newHero.isAlive = true
    return sanitizeHeroStats(newHero)
  })
}

interface GameStore extends GameState {
  // Actions
  addHero: (hero: Hero) => void
  addHeroByClass: (heroClass: any) => void
  removeHero: (heroId: string) => void
  updateHero: (heroId: string, updates: Partial<Hero>) => void
  startDungeon: () => void
  advanceDungeon: () => void
  selectChoice: (choice: EventChoice) => void
  endGame: () => void
  retreatFromDungeon: () => void
  resetGame: () => void
  applyPenalty: () => void
  repairParty: () => void
  // Inventory actions
  equipItemToHero: (heroId: string, item: Item, slot: ItemSlot) => void
  unequipItemFromHero: (heroId: string, slot: ItemSlot) => Item | null
  sellItemForGold: (item: Item) => void
  equipItemFromBank: (heroId: string, item: Item, slot: ItemSlot) => void
  moveItemToBank: (item: Item) => void
  removeItemFromBank: (itemId: string) => void
  expandBankStorage: (slots: number) => void
  keepOverflowItem: (itemId: string) => void
  discardOverflowItem: (itemId: string) => void
  clearOverflow: () => void
}

const initialState: GameState = {
  party: [],
  heroRoster: [],
  dungeon: {
    depth: 0,
    maxDepth: 100,
    currentEvent: null,
    eventHistory: [],
    gold: 0,
    inventory: [],
  },
  bankGold: 0,
  bankInventory: [],
  bankStorageSlots: 20, // Start with 20 slots
  overflowInventory: [],
  isGameOver: false,
  isPaused: false,
  hasPendingPenalty: false,
  activeRun: null,
  runHistory: [],
  lastOutcome: null,
}

export const useGameStore = create<GameStore>()(
  persist(
    sanitizeMiddleware(
      (set, get) => ({
        ...initialState,
  
  addHero: (hero) => 
    set((state) => {
      // Add to roster if not already there
      const existingInRoster = state.heroRoster.find(h => h.id === hero.id)
      return {
        party: [...state.party, hero],
        heroRoster: existingInRoster ? state.heroRoster : [...state.heroRoster, hero]
      }
    }),
  
  addHeroByClass: (heroClass) => 
    set((state) => {
      // Find existing hero of this class in roster that's not currently in party
      const existingHero = state.heroRoster.find(
        h => h.class.id === heroClass.id && !state.party.some(p => p.id === h.id)
      )
      
      if (existingHero) {
        // Reuse existing hero
        return {
          party: [...state.party, existingHero]
        }
      } else {
        // Create new hero
        const newHero = createHero(heroClass, heroClass.name)
        return {
          party: [...state.party, newHero],
          heroRoster: [...state.heroRoster, newHero]
        }
      }
    }),
  
  removeHero: (heroId) => 
    set((state) => ({ 
      party: state.party.filter(h => h.id !== heroId) 
    })),
  
  updateHero: (heroId, updates) => 
    set((state) => {
      const updatedParty = state.party.map(h => 
        h.id === heroId ? { ...h, ...updates } : h
      )
      const updatedRoster = state.heroRoster.map(h => 
        h.id === heroId ? { ...h, ...updates } : h
      )
      return {
        party: updatedParty,
        heroRoster: updatedRoster
      }
    }),
  
  startDungeon: () => 
    set((state) => {
      // Penalty should already be applied by PartySetupScreen
      // Create a new run
      const newRun: import('@/types').Run = {
        id: `run-${Date.now()}`,
        startDate: Date.now(),
        startDepth: 1,
        finalDepth: 1,
        result: 'active',
        goldEarned: 0,
        goldSpent: 0,
        eventsCompleted: 0,
        heroesUsed: state.party.map(h => ({
          name: h.name,
          class: h.class.name,
          level: h.level
        }))
      }
      
      const event = getNextEvent(1, [])
      return {
        dungeon: { 
          depth: 1,
          maxDepth: 100,
          currentEvent: event,
          eventHistory: event ? [event.id] : [],
          gold: 0, // Reset gold for each new run
          inventory: [], // Reset inventory for each new run
        },
        isGameOver: false,
        hasPendingPenalty: false,
        activeRun: newRun,
        lastOutcome: null,
      }
    }),
  
  advanceDungeon: () => 
    set((state) => {
      const newDepth = state.dungeon.depth + 1
      const event = getNextEvent(newDepth, state.dungeon.eventHistory)
      
      // Update active run
      const updatedRun = state.activeRun ? {
        ...state.activeRun,
        finalDepth: newDepth,
        eventsCompleted: state.activeRun.eventsCompleted + 1
      } : null
      
      return {
        dungeon: { 
          ...state.dungeon, 
          depth: newDepth,
          currentEvent: event,
          eventHistory: event ? [...state.dungeon.eventHistory, event.id] : state.dungeon.eventHistory
        },
        activeRun: updatedRun,
        lastOutcome: null
      }
    }),
  
  selectChoice: (choice) =>
    set((state) => {
      const { updatedParty, updatedGold, resolvedOutcome } = resolveEventOutcome(
        choice.outcome,
        state.party,
        state.dungeon
      )
      
      // Check if wiped
      const isWiped = updatedParty.every(h => !h.isAlive)
      
      // Track gold changes in active run
      const goldDiff = updatedGold - state.dungeon.gold
      const updatedRun = state.activeRun ? {
        ...state.activeRun,
        goldEarned: state.activeRun.goldEarned + (goldDiff > 0 ? goldDiff : 0),
        goldSpent: state.activeRun.goldSpent + (goldDiff < 0 ? -goldDiff : 0)
      } : null
      
      return {
        party: updatedParty,
        dungeon: {
          ...state.dungeon,
          gold: updatedGold,
          currentEvent: null // Clear current event after resolution
        },
        isGameOver: isWiped,
        lastOutcome: resolvedOutcome,
        activeRun: updatedRun
      }
    }),
  
  endGame: () => 
    set((state) => {
      // Complete the active run
      if (state.activeRun) {
        const completedRun: import('@/types').Run = {
          ...state.activeRun,
          endDate: Date.now(),
          result: 'defeat',
          finalDepth: state.dungeon.depth,
          heroesUsed: state.party.map(h => ({
            name: h.name,
            class: h.class.name,
            level: h.level
          }))
        }
        
        // Lose all gold on defeat if penalty is enabled
        const loseGold = import('@/config/game').GAME_CONFIG.deathPenalty.loseAllGoldOnDefeat
        
        return {
          isGameOver: true,
          hasPendingPenalty: true,
          activeRun: null,
          runHistory: [completedRun, ...state.runHistory],
          dungeon: loseGold ? { ...state.dungeon, gold: 0 } : state.dungeon
        }
      }
      
      return { isGameOver: true, hasPendingPenalty: true }
    }),
  
  retreatFromDungeon: () =>
    set((state) => {
      // Complete the active run as retreat (no death penalty)
      if (state.activeRun) {
        const completedRun: import('@/types').Run = {
          ...state.activeRun,
          endDate: Date.now(),
          result: 'retreat',
          finalDepth: state.dungeon.depth,
          heroesUsed: state.party.map(h => ({
            name: h.name,
            class: h.class.name,
            level: h.level
          }))
        }
        
        // Add in-run gold to bank on successful retreat
        const goldToBank = Math.max(0, state.dungeon.gold)
        
        // Handle inventory - items that fit go to bank, overflow goes to temporary storage
        const availableSlots = state.bankStorageSlots - state.bankInventory.length
        const itemsToBank = state.dungeon.inventory.slice(0, availableSlots)
        const itemsToOverflow = state.dungeon.inventory.slice(availableSlots)
        
        return {
          dungeon: {
            depth: 0,
            maxDepth: 100,
            currentEvent: null,
            eventHistory: [],
            gold: 0,
            inventory: [],
          },
          bankGold: state.bankGold + goldToBank,
          bankInventory: [...state.bankInventory, ...itemsToBank],
          overflowInventory: itemsToOverflow,
          isGameOver: false,
          hasPendingPenalty: false,
          activeRun: null,
          runHistory: [completedRun, ...state.runHistory]
        }
      }
      
      return {}
    }),
  
  applyPenalty: () =>
    set((state) => {
      const penalizedParty = applyPenaltyToParty(state.party)
      // Update roster with penalized heroes
      const updatedRoster = state.heroRoster.map(rosterHero => {
        const penalizedVersion = penalizedParty.find(h => h.id === rosterHero.id)
        return penalizedVersion || rosterHero
      })
      return {
        party: penalizedParty,
        heroRoster: updatedRoster,
        hasPendingPenalty: false,
      }
    }),
  
  repairParty: () =>
    set((state) => {
      const needsRepair = state.party.some(hero => 
        isNaN(hero.stats.hp) || isNaN(hero.stats.maxHp)
      )
      if (needsRepair) {
        return { party: state.party.map(h => sanitizeHeroStats({ ...h, stats: { ...h.stats } })) }
      }
      return {}
    }),
  
  equipItemToHero: (heroId, item, slot) =>
    set((state) => {
      const updatedParty = state.party.map(h =>
        h.id === heroId ? equipItem(h, item, slot) : h
      )
      const updatedRoster = state.heroRoster.map(h =>
        h.id === heroId ? equipItem(h, item, slot) : h
      )
      return {
        party: updatedParty,
        heroRoster: updatedRoster
      }
    }),
  
  unequipItemFromHero: (heroId, slot) => {
    const hero = useGameStore.getState().party.find(h => h.id === heroId)
    if (!hero) return null
    
    const { hero: updatedHero, item } = unequipItem(hero, slot)
    useGameStore.setState((state) => ({
      party: state.party.map(h => h.id === heroId ? updatedHero : h)
    }))
    
    return item
  },
  
  sellItemForGold: (item) =>
    set((state) => ({
      dungeon: {
        ...state.dungeon,
        gold: state.dungeon.gold + sellItem(item)
      }
    })),
  
  equipItemFromBank: (heroId, item, slot) =>
    set((state) => {
      const updatedParty = state.party.map(h =>
        h.id === heroId ? equipItem(h, item, slot) : h
      )
      const updatedRoster = state.heroRoster.map(h =>
        h.id === heroId ? equipItem(h, item, slot) : h
      )
      // Remove item from bank
      const updatedBank = state.bankInventory.filter(i => i.id !== item.id)
      
      return {
        party: updatedParty,
        heroRoster: updatedRoster,
        bankInventory: updatedBank
      }
    }),
  
  moveItemToBank: (item) =>
    set((state) => ({
      bankInventory: [...state.bankInventory, item]
    })),
  
  removeItemFromBank: (itemId) =>
    set((state) => ({
      bankInventory: state.bankInventory.filter(i => i.id !== itemId)
    })),
  
  expandBankStorage: (slots) =>
    set((state) => {
      const costPerSlot = 50 // 50 gold per slot
      const totalCost = slots * costPerSlot
      
      if (state.bankGold >= totalCost) {
        return {
          bankStorageSlots: state.bankStorageSlots + slots,
          bankGold: state.bankGold - totalCost
        }
      }
      return {}
    }),
  
  keepOverflowItem: (itemId) =>
    set((state) => {
      const item = state.overflowInventory.find(i => i.id === itemId)
      if (!item) return {}
      
      const availableSlots = state.bankStorageSlots - state.bankInventory.length
      if (availableSlots > 0) {
        return {
          overflowInventory: state.overflowInventory.filter(i => i.id !== itemId),
          bankInventory: [...state.bankInventory, item]
        }
      }
      return {}
    }),
  
  discardOverflowItem: (itemId) =>
    set((state) => ({
      overflowInventory: state.overflowInventory.filter(i => i.id !== itemId)
    })),
  
  clearOverflow: () =>
    set({ overflowInventory: [] }),
  
  resetGame: () => 
    set(initialState),
      })
    ),
    {
      name: 'dungeon-runner-storage',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name)
          if (!str) return null
          const state = JSON.parse(str) as GameState
          // Repair any NaN values when loading from storage
          if (state.party?.length > 0) {
            const needsRepair = state.party.some(hero => 
              isNaN(hero.stats.hp) || isNaN(hero.stats.maxHp)
            )
            if (needsRepair) {
              state.party = state.party.map(h => sanitizeHeroStats({ ...h, stats: { ...h.stats } }))
            }
          }
          // Also repair heroRoster
          if (state.heroRoster?.length > 0) {
            const needsRepair = state.heroRoster.some(hero => 
              isNaN(hero.stats.hp) || isNaN(hero.stats.maxHp)
            )
            if (needsRepair) {
              state.heroRoster = state.heroRoster.map(h => sanitizeHeroStats({ ...h, stats: { ...h.stats } }))
            }
          }
          return state
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value))
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
)

// Repair party on initial mount
useGameStore.getState().repairParty()

