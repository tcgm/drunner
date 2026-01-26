import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { StateCreator } from 'zustand'
import type { GameState, Hero, EventChoice } from '@/types'
import { getNextEvent } from '@systems/events/eventSelector'
import { resolveEventOutcome } from '@systems/events/eventResolver'
import { GAME_CONFIG } from '@/config/game'
import { calculateMaxHp } from '@/utils/heroUtils'

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
  removeHero: (heroId: string) => void
  updateHero: (heroId: string, updates: Partial<Hero>) => void
  startDungeon: () => void
  advanceDungeon: () => void
  selectChoice: (choice: EventChoice) => void
  endGame: () => void
  resetGame: () => void
  applyPenalty: () => void
  repairParty: () => void
}

const initialState: GameState = {
  party: [],
  dungeon: {
    depth: 0,
    maxDepth: 100,
    currentEvent: null,
    eventHistory: [],
    gold: 0,
  },
  isGameOver: false,
  isPaused: false,
  hasPendingPenalty: false,
  lastOutcome: null,
}

export const useGameStore = create<GameStore>()(
  persist(
    sanitizeMiddleware(
      (set, get) => ({
        ...initialState,
  
  addHero: (hero) => 
    set((state) => ({ 
      party: [...state.party, hero] 
    })),
  
  removeHero: (heroId) => 
    set((state) => ({ 
      party: state.party.filter(h => h.id !== heroId) 
    })),
  
  updateHero: (heroId, updates) => 
    set((state) => ({
      party: state.party.map(h => 
        h.id === heroId ? { ...h, ...updates } : h
      )
    })),
  
  startDungeon: () => 
    set((state) => {
      // Apply death penalty to heroes if pending
      let penalizedParty = state.party
      if (state.hasPendingPenalty) {
        penalizedParty = applyPenaltyToParty(state.party)
      }
      
      const event = getNextEvent(1, [])
      return {
        party: penalizedParty,
        dungeon: { 
          depth: 1,
          maxDepth: 100,
          currentEvent: event,
          eventHistory: event ? [event.id] : [],
          gold: state.dungeon.gold, // Keep gold across runs
        },
        isGameOver: false,
        hasPendingPenalty: false,
        lastOutcome: null,
      }
    }),
  
  advanceDungeon: () => 
    set((state) => {
      const newDepth = state.dungeon.depth + 1
      const event = getNextEvent(newDepth, state.dungeon.eventHistory)
      return {
        dungeon: { 
          ...state.dungeon, 
          depth: newDepth,
          currentEvent: event,
          eventHistory: event ? [...state.dungeon.eventHistory, event.id] : state.dungeon.eventHistory
        },
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
      
      return {
        party: updatedParty,
        dungeon: {
          ...state.dungeon,
          gold: updatedGold,
          currentEvent: null // Clear current event after resolution
        },
        isGameOver: isWiped,
        lastOutcome: resolvedOutcome
      }
    }),
  
  endGame: () => 
    set({ isGameOver: true, hasPendingPenalty: true }),
  
  applyPenalty: () =>
    set((state) => ({
      party: applyPenaltyToParty(state.party),
      hasPendingPenalty: false,
    })),
  
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
  
  resetGame: () => 
    set(initialState),
      })
    ),
    {
      name: 'dungeon-runner-storage',
      storage: {
        getItem: (name) => {
          const str = sessionStorage.getItem(name)
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
          return state
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value))
        },
        removeItem: (name) => sessionStorage.removeItem(name),
      },
    }
  )
)

// Repair party on initial mount
useGameStore.getState().repairParty()

