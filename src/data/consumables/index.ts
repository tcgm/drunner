import { Consumable } from '../../types'

// Export all consumables by category
export * from './potions'
// export * from './scrolls' // TODO: Add scrolls
// export * from './food' // TODO: Add food

// Import arrays from each category
import { ALL_POTIONS } from './potions'

// Master list of all consumables
export const ALL_CONSUMABLES: Consumable[] = [
  ...ALL_POTIONS,
  // ...ALL_SCROLLS, // TODO
  // ...ALL_FOOD, // TODO
]

// Helper to get consumable by ID
export function getConsumableById(id: string): Consumable | undefined {
  return ALL_CONSUMABLES.find((c) => c.id === id)
}
