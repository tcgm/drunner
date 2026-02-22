/**
 * Test to verify Zustand state merging behavior
 * This will help us understand if there's an issue with state merging
 */

import { create } from 'zustand'

// Simple test store
const useTestStore = create((set) => ({
  field1: 100,
  field2: 200,
  field3: 300,
  
  updateField1: () => set({ field1: 999 }),
  updateField2: () => set({ field2: 888 }),
  updateWithReturn: () => set((state) => {
    console.log('State before update:', state)
    return { field1: 777 }
  }),
}))

// Test 1: Basic set with object
console.log('\n=== Test 1: Basic set ===')
const store1 = useTestStore.getState()
console.log('Initial state:', { field1: store1.field1, field2: store1.field2, field3: store1.field3 })

store1.updateField1()
const after1 = useTestStore.getState()
console.log('After updateField1:', { field1: after1.field1, field2: after1.field2, field3: after1.field3 })
console.log('field2 and field3 preserved?', after1.field2 === 200 && after1.field3 === 300 ? '✓ YES' : '✗ NO')

// Test 2: set with function returning partial state
console.log('\n=== Test 2: set with function ===')
store1.updateField2()
const after2 = useTestStore.getState()
console.log('After updateField2:', { field1: after2.field1, field2: after2.field2, field3: after2.field3 })
console.log('field1 and field3 preserved?', after2.field1 === 999 && after2.field3 === 300 ? '✓ YES' : '✗ NO')

// Test 3: set with callback
console.log('\n=== Test 3: set with state callback ===')
store1.updateWithReturn()
const after3 = useTestStore.getState()
console.log('After updateWithReturn:', { field1: after3.field1, field2: after3.field2, field3: after3.field3 })
console.log('field2 and field3 preserved?', after3.field2 === 888 && after3.field3 === 300 ? '✓ YES' : '✗ NO')

// Test 4: Nested object spreading (similar to your dungeonActions pattern)
console.log('\n=== Test 4: Complex nested update ===')
const useComplexStore = create((set) => ({
  alkahest: 1000,
  bankGold: 5000,
  dungeon: {
    depth: 5,
    gold: 100,
  },
  
  updateDungeon: () => set((state) => ({
    dungeon: {
      depth: 10,
      gold: 200,
    },
    bankGold: state.bankGold + state.dungeon.gold,
  })),
}))

const complexInitial = useComplexStore.getState()
console.log('Initial:', { alkahest: complexInitial.alkahest, bankGold: complexInitial.bankGold, dungeon: complexInitial.dungeon })

complexInitial.updateDungeon()
const complexAfter = useComplexStore.getState()
console.log('After updateDungeon:', { alkahest: complexAfter.alkahest, bankGold: complexAfter.bankGold, dungeon: complexAfter.dungeon })
console.log('alkahest preserved?', complexAfter.alkahest === 1000 ? '✓ YES' : '✗ NO - THIS IS THE BUG!')

console.log('\n=== Conclusion ===')
if (complexAfter.alkahest === 1000) {
  console.log('✓ Zustand is working correctly - the issue is elsewhere in your code')
} else {
  console.log('✗ Zustand state merging is broken - this would be very unusual')
}
