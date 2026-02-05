// Kitsune set items
export * from './weapon'
export * from './armor'
export * from './helmet'
export * from './boots'
export * from './accessory1'
export * from './accessory2'
export * from './effects'

import { KITSUNE_BITE } from './weapon'
import { KITSUNE_GRACE } from './armor'
import { KITSUNE_VISION } from './helmet'
import { KITSUNE_STEPS } from './boots'
import { KITSUNE_CHARM } from './accessory1'
import { KITSUNE_SOUL } from './accessory2'
import { KITSUNE_SET_BONUSES } from './effects'

export const KITSUNE_SET_ITEMS = [
  KITSUNE_BITE,
  KITSUNE_GRACE,
  KITSUNE_VISION,
  KITSUNE_STEPS,
  KITSUNE_CHARM,
  KITSUNE_SOUL,
]

export const KITSUNE_SET_NAME = 'Kitsune'

// Re-export bonuses for backward compatibility
export { KITSUNE_SET_BONUSES }
