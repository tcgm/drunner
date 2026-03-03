// Bunny set items
export * from './weapon'
export * from './armor'
export * from './helmet'
export * from './boots'
export * from './accessory1'
export * from './accessory2'
export * from './effects'

import { COCKTAIL_TRAY } from './weapon'
import { VELVET_LEOTARD } from './armor'
import { SATIN_BUNNY_EARS } from './helmet'
import { STILETTO_HEELS } from './boots'
import { BOW_TIE_COLLAR } from './accessory1'
import { FLUFFY_TAIL } from './accessory2'
import { BUNNY_SET_BONUSES } from './effects'

export const BUNNY_SET_ITEMS = [
  COCKTAIL_TRAY,
  VELVET_LEOTARD,
  SATIN_BUNNY_EARS,
  STILETTO_HEELS,
  BOW_TIE_COLLAR,
  FLUFFY_TAIL,
]

export const BUNNY_SET_NAME = 'Bunny'

// Re-export bonuses for backward compatibility
export { BUNNY_SET_BONUSES }
