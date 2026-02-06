import type { Consumable } from '@/types'
import { CONSUMABLE_AUTOFILL_PRIORITIES } from '@/config/consumableAutofillConfig'

/**
 * Selects the best consumables from bank inventory to fill hero slots
 * Returns array of 3 consumables (or null for empty slots)
 */
export function selectConsumablesForAutofill(
  bankConsumables: Consumable[]
): (Consumable | null)[] {
  const slots: (Consumable | null)[] = [null, null, null]
  let filledSlots = 0
  const usedIds = new Set<string>()

  // Sort consumables by value (higher value = better quality)
  const sortedConsumables = [...bankConsumables].sort((a, b) => b.value - a.value)

  // Try each priority in order
  for (const priority of CONSUMABLE_AUTOFILL_PRIORITIES) {
    if (filledSlots >= 3) break

    // Find consumables matching this priority
    const matchingConsumables = sortedConsumables.filter(consumable => {
      // Skip if already used
      if (usedIds.has(consumable.id)) return false
      
      // Check if any effect matches the priority
      const hasMatchingEffect = consumable.effects.some(effect => {
        // Check effect type
        if (effect.type !== priority.effectType) return false
        
        // For buffs, check stat match if specified
        if (priority.effectType === 'buff' && priority.stat) {
          if (effect.stat !== priority.stat) return false
        }
        
        return true
      })
      
      return hasMatchingEffect
    })

    // Fill up to max slots for this priority
    let filled = 0
    for (const consumable of matchingConsumables) {
      if (filledSlots >= 3 || filled >= priority.max) break
      
      slots[filledSlots] = consumable
      usedIds.add(consumable.id)
      filledSlots++
      filled++
    }
  }

  return slots
}
