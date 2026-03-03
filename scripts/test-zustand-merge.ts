/**
 * Test to verify Zustand merge behavior
 * Run this to see if Zustand is properly merging state
 */

import { create } from 'zustand'

interface TestState {
  alkahest: number
  bankGold: number
  party: string[]
}

const useTestStore = create<TestState & { updateParty: () => void }>((set) => ({
  alkahest: 100,
  bankGold: 500,
  party: ['hero1', 'hero2'],
  
  updateParty: () => set((state) => {
    console.log('Before update:', state)
    // Only returning party and bankGold, NOT alkahest
    const result = {
      party: ['hero1', 'hero2', 'hero3'],
      bankGold: state.bankGold + 50
    }
    console.log('Returning:', result)
    return result
  })
}))

// Test it
console.log('=== ZUSTAND MERGE TEST ===')
const initialState = useTestStore.getState()
console.log('Initial state:', initialState)

useTestStore.getState().updateParty()

const afterUpdate = useTestStore.getState()
console.log('After update:', afterUpdate)
console.log('Alkahest preserved?', afterUpdate.alkahest === 100)
