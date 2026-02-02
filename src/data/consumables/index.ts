import { Consumable } from '../../types'

// Export new procedural system
export * from './bases'
export * from './sizes'
export * from './potencies'

// Export all consumables by category (legacy pre-defined consumables)
export * from './potions'
// export * from './scrolls' // TODO: Add scrolls
// export * from './food' // TODO: Add food

// Import arrays from each category
import { ALL_POTIONS } from './potions'
import { generateConsumable } from '../../systems/consumables/consumableGenerator'

// Master list of all pre-defined consumables (legacy)
export const ALL_CONSUMABLES: Consumable[] = [
  ...ALL_POTIONS,
  // ...ALL_SCROLLS, // TODO
  // ...ALL_FOOD, // TODO
]

// Helper to get consumable by ID (checks pre-defined first, then generates)
export function getConsumableById(id: string): Consumable | undefined {
  // Check pre-defined consumables first
  const predefined = ALL_CONSUMABLES.find((c) => c.id === id)
  if (predefined) return predefined
  
  // Try to generate from base ID (for new system)
  // Format: "baseId-sizeId" or "baseId-sizeId-potencyId" or just "baseId"
  const parts = id.split('-')
  if (parts.length >= 1) {
    try {
      const baseId = parts[0]
      const sizeId = parts.length > 1 ? parts[1] : 'small'
      const potencyId = parts.length > 2 ? parts[2] : 'normal'
      return generateConsumable(baseId, sizeId, potencyId, 'common')
    } catch (e) {
      return undefined
    }
  }
  
  return undefined
}
