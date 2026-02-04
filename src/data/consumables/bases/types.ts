import type { ConsumableEffect } from '@/types'
import type { IconType } from 'react-icons'

/**
 * Base consumable template - defines the effect type
 */
export interface ConsumableBase {
  id: string
  name: string // Base name like "Health", "Strength", "Speed"
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
