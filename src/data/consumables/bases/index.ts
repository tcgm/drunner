export * from './types'
export * from './health'
export * from './strength'
export * from './ironSkin'
export * from './haste'
export * from './luck'
export * from './phoenixDown'

import { HEALTH_BASE } from './health'
import { STRENGTH_BASE } from './strength'
import { IRON_SKIN_BASE } from './ironSkin'
import { HASTE_BASE } from './haste'
import { LUCK_BASE } from './luck'
import { PHOENIX_DOWN_BASE } from './phoenixDown'
import { ALL_FOOD_BASES } from '../food'
import { ALL_SUPPLY_BASES } from '../supplies'
import type { ConsumableBase } from './types'

// Potion bases (alchemical consumables)
export const ALL_POTION_BASES: ConsumableBase[] = [
  HEALTH_BASE,
  STRENGTH_BASE,
  IRON_SKIN_BASE,
  HASTE_BASE,
  LUCK_BASE,
  PHOENIX_DOWN_BASE,
]

// All consumable bases combined
export const ALL_CONSUMABLE_BASES: ConsumableBase[] = [
  ...ALL_POTION_BASES,
  ...ALL_FOOD_BASES,
  ...ALL_SUPPLY_BASES,
]

export function getConsumableBaseById(id: string): ConsumableBase | undefined {
  return ALL_CONSUMABLE_BASES.find(b => b.id === id)
}

export function getRandomConsumableBase(): ConsumableBase {
  return ALL_CONSUMABLE_BASES[Math.floor(Math.random() * ALL_CONSUMABLE_BASES.length)]
}

export function getRandomPotionBase(): ConsumableBase {
  return ALL_POTION_BASES[Math.floor(Math.random() * ALL_POTION_BASES.length)]
}
