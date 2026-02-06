export * from './types'
export * from './bread'
export * from './meat'
export * from './cheese'
export * from './fruit'
export * from './stew'
export * from './rations'

import { BREAD_BASE } from './bread'
import { MEAT_BASE } from './meat'
import { CHEESE_BASE } from './cheese'
import { FRUIT_BASE } from './fruit'
import { STEW_BASE } from './stew'
import { RATIONS_BASE } from './rations'
import type { ConsumableBase } from '../bases/types'

export const ALL_FOOD_BASES: ConsumableBase[] = [
  BREAD_BASE,
  MEAT_BASE,
  CHEESE_BASE,
  FRUIT_BASE,
  STEW_BASE,
  RATIONS_BASE,
]

export function getFoodBaseById(id: string): ConsumableBase | undefined {
  return ALL_FOOD_BASES.find(b => b.id === id)
}

export function getRandomFoodBase(): ConsumableBase {
  return ALL_FOOD_BASES[Math.floor(Math.random() * ALL_FOOD_BASES.length)]
}
