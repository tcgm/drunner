import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GameState, Hero, EventChoice } from '@/types'
import { getNextEvent } from '@systems/events/eventSelector'
import { resolveEventOutcome } from '@systems/events/eventResolver'
import { GAME_CONFIG } from '@/config/game'
import { calculateMaxHp } from '@/utils/heroUtils'

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
  lastOutcome: null,
}

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
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
      // Apply death penalty to heroes if this is a retry after game over
      let penalizedParty = state.party
      if (state.isGameOver) {
        penalizedParty = state.party.map(hero => {
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
              newHero.stats.maxHp = calculateMaxHp(hero.class.baseStats, newHero.level)
              newHero.stats.hp = newHero.stats.maxHp
              break
              
            case 'reset-levels':
              // Reset to level 1
              newHero.level = 1
              newHero.xp = 0
              newHero.stats = {
                hp: calculateMaxHp(hero.class.baseStats, 1),
                maxHp: calculateMaxHp(hero.class.baseStats, 1),
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
                accessory: null,
                helmet: null,
                boots: null,
                ring: null,
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
          return newHero
        })
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
      
      // Check if party is wiped
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
    set({ isGameOver: true }),
  
  resetGame: () => 
    set(initialState),
    }),
    {
      name: 'dungeon-runner-storage',
      storage: {
        getItem: (name) => {
          const str = sessionStorage.getItem(name)
          return str ? JSON.parse(str) : null
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value))
        },
        removeItem: (name) => sessionStorage.removeItem(name),
      },
    }
  )
)
