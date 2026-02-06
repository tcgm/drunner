import { Consumable } from '../../types'

// Export new procedural system (PRIMARY)
export * from './bases'
export * from './sizes'
export * from './potencies'

// Export all consumables by category
export * from './potions'
export * from './food'
export * from './supplies'
// export * from './scrolls' // TODO: Add scrolls

// Import arrays from each category
import { ALL_POTIONS } from './potions'
import { generateConsumable, generateConsumableForFloor, generatePotionForFloor } from '../../systems/consumables/consumableGenerator'

// Legacy pre-defined consumables (kept for backwards compatibility)
export const LEGACY_CONSUMABLES: Consumable[] = [
  ...ALL_POTIONS,
  // ...ALL_SCROLLS, // TODO
  // ...ALL_FOOD, // TODO
]

// Master list includes both systems - procedural is now primary
export const ALL_CONSUMABLES: Consumable[] = [
  ...LEGACY_CONSUMABLES,
]

// Export procedural generator as primary method
export { generateConsumable, generateConsumableForFloor, generatePotionForFloor }

// Helper to get consumable by ID (tries procedural generation first, then legacy)
export function getConsumableById(id: string): Consumable | undefined {
  // Try to generate from procedural system first (PRIMARY)
  // Format: "baseId-sizeId-potencyId" or "baseId-sizeId" or just "baseId"
  const parts = id.split('-')
  if (parts.length >= 1) {
    try {
      const baseId = parts[0]
      const sizeId = parts.length > 1 ? parts[1] : 'small'
      const potencyId = parts.length > 2 ? parts[2] : 'normal'
      const generated = generateConsumable(baseId, sizeId, potencyId, 'common')
      if (generated) return generated
    } catch (e) {
      // Fall through to legacy check
    }
  }
  
  // Fallback to legacy pre-defined consumables for backwards compatibility
  const legacy = LEGACY_CONSUMABLES.find((c) => c.id === id)
  if (legacy) return legacy
  
  return undefined
}
