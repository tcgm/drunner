// Titan set items
export * from './weapon'
export * from './armor'
export * from './helmet'
export * from './boots'
export * from './accessory1'
export * from './accessory2'
export * from './effects'

import { TITANS_WRATH } from './weapon'
import { TITANS_GUARD } from './armor'
import { TITANS_CROWN } from './helmet'
import { TITANS_STRIDE } from './boots'
import { TITANS_FIST } from './accessory1'
import { TITANS_AEGIS } from './accessory2'
import { TITAN_SET_BONUSES } from './effects'

export const TITAN_SET_ITEMS = [
  TITANS_WRATH,
  TITANS_GUARD,
  TITANS_CROWN,
  TITANS_STRIDE,
  TITANS_FIST,
  TITANS_AEGIS,
]

export const TITAN_SET_NAME = 'Titan'

// Re-export bonuses for backward compatibility
export { TITAN_SET_BONUSES }
