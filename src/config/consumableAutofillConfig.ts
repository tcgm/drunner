import type { ConsumableEffect } from '@/types'

/**
 * Configuration for auto-filling hero consumable slots
 */

export interface AutofillPriority {
  effectType: ConsumableEffect['type']
  stat?: string // For buff effects
  min: number // Minimum slots to fill with this type
  max: number // Maximum slots to fill with this type
}

/**
 * Priority order for autofilling consumables
 * System will try to fill slots in this order, moving to next priority if not enough items
 */
export const CONSUMABLE_AUTOFILL_PRIORITIES: AutofillPriority[] = [
  // Always try to have at least 1 revive
  { effectType: 'revive', min: 1, max: 1 },
  
  // Fill remaining with healing potions (up to 2 slots)
  { effectType: 'heal', min: 0, max: 2 },
  
  // If still space, add buffs (prefer attack, then defense)
  { effectType: 'buff', stat: 'attack', min: 0, max: 1 },
  { effectType: 'buff', stat: 'defense', min: 0, max: 1 },
  { effectType: 'buff', stat: 'speed', min: 0, max: 1 },
  { effectType: 'buff', stat: 'luck', min: 0, max: 1 },
]
