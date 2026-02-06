import type { ConsumableEffect } from '@/types'
import type { IconType } from 'react-icons'

/**
 * Base consumable template - defines the effect type
 */
export interface ConsumableBase {
  id: string
  name: string // Base name like "Health", "Strength", "Speed"
  description: string
  effects: Array<{
    type: ConsumableEffect['type']
    value: number
    stat?: keyof import('@/types').Stats
    duration?: number
    target?: ConsumableEffect['target']
  }> // Array of effects to generate
  icon: IconType
  baseGoldValue: number // Base gold value before multipliers
  usableInCombat: boolean
  usableOutOfCombat: boolean
}
