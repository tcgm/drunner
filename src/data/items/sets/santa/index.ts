// Santa set items
export * from './weapon'
export * from './armor'
export * from './helmet'
export * from './boots'
export * from './accessory1'
export * from './accessory2'
export * from './effects'

import { SANTAS_SACK } from './weapon'
import { SANTAS_SUIT } from './armor'
import { SANTAS_HAT } from './helmet'
import { SANTAS_BOOTS } from './boots'
import { SANTAS_MITTENS } from './accessory1'
import { SANTAS_PANTS } from './accessory2'
import { SANTA_SET_BONUSES } from './effects'

export const SANTA_SET_ITEMS = [
  SANTAS_SACK,
  SANTAS_SUIT,
  SANTAS_HAT,
  SANTAS_BOOTS,
  SANTAS_MITTENS,
  SANTAS_PANTS,
]

export const SANTA_SET_NAME = 'Santa'

// Re-export bonuses for backward compatibility
export { SANTA_SET_BONUSES }
