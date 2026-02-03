import type { ConsumableEffect } from '@/types'
import type { IconType } from 'react-icons'
import { GiHealthPotion, GiStrong, GiShield, GiRun, GiClover } from 'react-icons/gi'
import { LiaGripfire } from 'react-icons/lia'

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
  stat?: keyof import('@/types').Stats // For buff effects
  duration?: number // In floors for timed effects
  target?: ConsumableEffect['target']
  usableInCombat: boolean
  usableOutOfCombat: boolean
}

// Health restoration base
export const HEALTH_BASE: ConsumableBase = {
  id: 'health',
  name: 'Health',
  description: 'Restores HP',
  effectType: 'heal',
  icon: GiHealthPotion,
  baseValue: 50,
  target: 'self',
  usableInCombat: true,
  usableOutOfCombat: true,
}

// Strength buff base
export const STRENGTH_BASE: ConsumableBase = {
  id: 'strength',
  name: 'Strength',
  description: 'Increases attack power',
  effectType: 'buff',
  icon: GiStrong,
  baseValue: 10,
  stat: 'attack',
  duration: 3,
  target: 'self',
  usableInCombat: true,
  usableOutOfCombat: true,
}

// Defense buff base
export const IRON_SKIN_BASE: ConsumableBase = {
  id: 'iron-skin',
  name: 'Iron Skin',
  description: 'Increases defense',
  effectType: 'buff',
  icon: GiShield,
  baseValue: 10,
  stat: 'defense',
  duration: 3,
  target: 'self',
  usableInCombat: true,
  usableOutOfCombat: true,
}

// Speed buff base
export const HASTE_BASE: ConsumableBase = {
  id: 'haste',
  name: 'Haste',
  description: 'Increases speed',
  effectType: 'buff',
  icon: GiRun,
  baseValue: 10,
  stat: 'speed',
  duration: 3,
  target: 'self',
  usableInCombat: true,
  usableOutOfCombat: true,
}

// Luck buff base
export const LUCK_BASE: ConsumableBase = {
  id: 'luck',
  name: 'Luck',
  description: 'Increases luck',
  effectType: 'buff',
  icon: GiClover,
  baseValue: 10,
  stat: 'luck',
  duration: 3,
  target: 'self',
  usableInCombat: true,
  usableOutOfCombat: true,
}

// Resurrection - high rarity only
export const PHOENIX_DOWN_BASE: ConsumableBase = {
  id: 'phoenix-down',
  name: 'Phoenix Down',
  description: 'Resurrects a fallen hero',
  effectType: 'revive',
  icon: LiaGripfire,
  baseValue: 30, // Base HP restored on revive
  target: 'ally',
  usableInCombat: true,
  usableOutOfCombat: true,
}

export const ALL_CONSUMABLE_BASES: ConsumableBase[] = [
  HEALTH_BASE,
  STRENGTH_BASE,
  IRON_SKIN_BASE,
  HASTE_BASE,
  LUCK_BASE,
  PHOENIX_DOWN_BASE,
]

export function getConsumableBaseById(id: string): ConsumableBase | undefined {
  return ALL_CONSUMABLE_BASES.find(b => b.id === id)
}

export function getRandomConsumableBase(): ConsumableBase {
  return ALL_CONSUMABLE_BASES[Math.floor(Math.random() * ALL_CONSUMABLE_BASES.length)]
}
