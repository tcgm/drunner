// Draconic set items
export * from './weapon'
export * from './armor'
export * from './helmet'
export * from './boots'
export * from './accessory1'
export * from './accessory2'
export * from './effects'

import { DRACONIC_FANG } from './weapon'
import { DRACONIC_SCALES } from './armor'
import { DRACONIC_CROWN } from './helmet'
import { DRACONIC_TALONS } from './boots'
import { DRACONIC_HEART } from './accessory1'
import { DRACONIC_SOUL } from './accessory2'
import { DRACONIC_SET_BONUSES } from './effects'

export const DRACONIC_SET_ITEMS = [
  DRACONIC_FANG,
  DRACONIC_SCALES,
  DRACONIC_CROWN,
  DRACONIC_TALONS,
  DRACONIC_HEART,
  DRACONIC_SOUL,
]

export const DRACONIC_SET_NAME = 'Draconic'

// Re-export bonuses for backward compatibility
export { DRACONIC_SET_BONUSES }
