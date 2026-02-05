// Draconic set items
export * from './weapon'
export * from './armor'
export * from './helmet'
export * from './boots'
export * from './accessory1'
export * from './accessory2'

import { DRACONIC_FANG } from './weapon'
import { DRACONIC_SCALES } from './armor'
import { DRACONIC_CROWN } from './helmet'
import { DRACONIC_TALONS } from './boots'
import { DRACONIC_HEART } from './accessory1'
import { DRACONIC_SOUL } from './accessory2'

export const DRACONIC_SET_ITEMS = [
  DRACONIC_FANG,
  DRACONIC_SCALES,
  DRACONIC_CROWN,
  DRACONIC_TALONS,
  DRACONIC_HEART,
  DRACONIC_SOUL,
]

// Set bonuses - emphasizing power, defense, and HP
export const DRACONIC_SET_BONUSES = {
  2: { description: 'Dragon Blood (2 pieces): +50 HP, +10 Defense', stats: { maxHp: 50, defense: 10 } },
  4: { description: 'Dragon Might (4 pieces): +100 HP, +25 Defense, +30 Attack', stats: { maxHp: 100, defense: 25, attack: 30 } },
  6: { description: 'Ancient Dragon (Full Set): +200 HP, +50 Defense, +60 Attack, +40 Magic Power', stats: { maxHp: 200, defense: 50, attack: 60, magicPower: 40 } },
}

export const DRACONIC_SET_NAME = 'Draconic'
