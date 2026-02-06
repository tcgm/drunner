import type { ConsumableEffect } from '@/types'
import type { IconType } from 'react-icons'

/**
 * Supply consumable template - defines the effect type
 * Supply items are practical adventuring tools with consumable benefits
 */
export interface SupplyBase {
  id: string
  name: string // Base name like "Bandage", "Torch", "Oil"
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
