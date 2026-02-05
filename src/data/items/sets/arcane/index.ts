// Arcane set items
export * from './weapon'
export * from './armor'
export * from './helmet'
export * from './boots'
export * from './accessory1'
export * from './accessory2'
export * from './effects'

import { ARCANE_CONDUIT } from './weapon'
import { ARCANE_VESTMENTS } from './armor'
import { ARCANE_CIRCLET } from './helmet'
import { ARCANE_TREADS } from './boots'
import { ARCANE_TOME } from './accessory1'
import { ARCANE_ORB } from './accessory2'
import { ARCANE_SET_BONUSES } from './effects'

export const ARCANE_SET_ITEMS = [
  ARCANE_CONDUIT,
  ARCANE_VESTMENTS,
  ARCANE_CIRCLET,
  ARCANE_TREADS,
  ARCANE_TOME,
  ARCANE_ORB,
]

export const ARCANE_SET_NAME = 'Arcane'

// Re-export bonuses for backward compatibility
export { ARCANE_SET_BONUSES }
