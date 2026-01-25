import { create } from 'zustand'
import { GameState, Hero } from '@types/index'

interface GameStore extends GameState {
  // Actions
  addHero: (hero: Hero) => void
  removeHero: (heroId: string) => void
  updateHero: (heroId: string, updates: Partial<Hero>) => void
  startDungeon: () => void
  advanceDungeon: () => void
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
}

export const useGameStore = create<GameStore>((set) => ({
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
    set((state) => ({
      dungeon: { ...state.dungeon, depth: 1 }
    })),
  
  advanceDungeon: () => 
    set((state) => ({
      dungeon: { ...state.dungeon, depth: state.dungeon.depth + 1 }
    })),
  
  endGame: () => 
    set({ isGameOver: true }),
  
  resetGame: () => 
    set(initialState),
}))
