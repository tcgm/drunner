// Shadow set items
export * from './weapon'
export * from './armor'
export * from './helmet'
export * from './boots'
export * from './accessory1'
export * from './accessory2'

import { SHADOWS_EDGE } from './weapon'
import { SHADOWS_EMBRACE } from './armor'
import { SHADOWS_VEIL } from './helmet'
import { SHADOWS_WHISPER } from './boots'
import { SHADOWS_TOUCH } from './accessory1'
import { SHADOWS_HEART } from './accessory2'

export const SHADOW_SET_ITEMS = [
  SHADOWS_EDGE,
  SHADOWS_EMBRACE,
  SHADOWS_VEIL,
  SHADOWS_WHISPER,
  SHADOWS_TOUCH,
  SHADOWS_HEART,
]

// Set bonuses - emphasizing speed, luck, and critical strikes
export const SHADOW_SET_BONUSES = {
  2: { description: 'Shadow Step (2 pieces): +30 Speed, +20 Luck', stats: { speed: 30, luck: 20 } },
  4: { description: 'Veil of Night (4 pieces): +60 Speed, +40 Luck, +40 Attack', stats: { speed: 60, luck: 40, attack: 40 } },
  6: { description: 'Master Assassin (Full Set): +100 Speed, +80 Luck, +80 Attack, +30 Wisdom', stats: { speed: 100, luck: 80, attack: 80, wisdom: 30 } },
}

export const SHADOW_SET_NAME = 'Shadow'
