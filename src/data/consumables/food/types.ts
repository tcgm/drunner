import type { ConsumableEffect } from '@/types'
import type { IconType } from 'react-icons'

/**
 * Food consumable template - defines the effect type
 * Food items are similar to potions but with a culinary theme
 */
export interface FoodBase {
  id: string
  name: string // Base name like "Bread", "Meat", "Cheese"
  description: string
  effectType: ConsumableEffect['type']
  icon: IconType
  baseValue: number // Base effect value before size/rarity multipliers
  baseGoldValue: number // Base gold value before multipliers
  stat?: keyof import('@/types').Stats // For buff effects
  duration?: number // In floors for timed effects
  target?: ConsumableEffect['target']
  usableInCombat: boolean
  usableOutOfCombat: boolean
}
