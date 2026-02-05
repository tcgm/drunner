// Titan set items
export * from './weapon'
export * from './armor'
export * from './helmet'
export * from './boots'
export * from './accessory1'
export * from './accessory2'

import { TITANS_WRATH } from './weapon'
import { TITANS_BULWARK } from './armor'
import { TITANS_CROWN } from './helmet'
import { TITANS_STRIDE } from './boots'
import { TITANS_FIST } from './accessory1'
import { TITANS_AEGIS } from './accessory2'

export const TITAN_SET_ITEMS = [
  TITANS_WRATH,
  TITANS_BULWARK,
  TITANS_CROWN,
  TITANS_STRIDE,
  TITANS_FIST,
  TITANS_AEGIS,
]

// Set bonuses - emphasizing raw power, defense, and HP
export const TITAN_SET_BONUSES = {
  2: { description: 'Titan Strength (2 pieces): +40 Attack, +30 Defense', stats: { attack: 40, defense: 30 } },
  4: { description: 'Titan Fortitude (4 pieces): +80 Attack, +60 Defense, +80 HP', stats: { attack: 80, defense: 60, maxHp: 80 } },
  6: { description: 'Primordial Might (Full Set): +140 Attack, +100 Defense, +150 HP', stats: { attack: 140, defense: 100, maxHp: 150 } },
}

export const TITAN_SET_NAME = 'Titan'
