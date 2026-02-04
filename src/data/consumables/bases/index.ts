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
import type { ConsumableBase } from './types'

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
