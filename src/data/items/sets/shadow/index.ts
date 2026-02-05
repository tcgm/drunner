// Shadow set items
export * from './weapon'
export * from './armor'
export * from './helmet'
export * from './boots'
export * from './accessory1'
export * from './accessory2'
export * from './effects'

import { SHADOWS_EDGE } from './weapon'
import { SHADOWS_EMBRACE } from './armor'
import { SHADOWS_VEIL } from './helmet'
import { SHADOWS_WHISPER } from './boots'
import { SHADOWS_TOUCH } from './accessory1'
import { SHADOWS_HEART } from './accessory2'
import { SHADOW_SET_BONUSES } from './effects'

export const SHADOW_SET_ITEMS = [
  SHADOWS_EDGE,
  SHADOWS_EMBRACE,
  SHADOWS_VEIL,
  SHADOWS_WHISPER,
  SHADOWS_TOUCH,
  SHADOWS_HEART,
]

export const SHADOW_SET_NAME = 'Shadow'

// Re-export bonuses for backward compatibility
export { SHADOW_SET_BONUSES }
