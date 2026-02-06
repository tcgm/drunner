export * from './types'
export * from './bandages'
export * from './torch'
export * from './whetstone'
export * from './armorPolish'
export * from './oil'

import { BANDAGES_BASE } from './bandages'
import { TORCH_BASE } from './torch'
import { WHETSTONE_BASE } from './whetstone'
import { ARMOR_POLISH_BASE } from './armorPolish'
import { OIL_BASE } from './oil'
import type { ConsumableBase } from '../bases/types'

export const ALL_SUPPLY_BASES: ConsumableBase[] = [
  BANDAGES_BASE,
  TORCH_BASE,
  WHETSTONE_BASE,
  ARMOR_POLISH_BASE,
  OIL_BASE,
]

export function getSupplyBaseById(id: string): ConsumableBase | undefined {
  return ALL_SUPPLY_BASES.find(b => b.id === id)
}

export function getRandomSupplyBase(): ConsumableBase {
  return ALL_SUPPLY_BASES[Math.floor(Math.random() * ALL_SUPPLY_BASES.length)]
}
