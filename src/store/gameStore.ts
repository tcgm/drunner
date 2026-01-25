import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GameState, Hero, EventChoice } from '@/types'
import { getNextEvent } from '@systems/events/eventSelector'
import { resolveEventOutcome } from '@systems/events/eventResolver'

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
      const event = getNextEvent(1, [])
      return {
        dungeon: { 
          ...state.dungeon, 
          depth: 1,
          currentEvent: event
        }
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
