// Kitsune set items
export * from './weapon'
export * from './armor'
export * from './helmet'
export * from './boots'
export * from './accessory1'
export * from './accessory2'

import { KITSUNE_BITE } from './weapon'
import { KITSUNE_GRACE } from './armor'
import { KITSUNE_VISION } from './helmet'
import { KITSUNE_STEPS } from './boots'
import { KITSUNE_CHARM } from './accessory1'
import { KITSUNE_SOUL } from './accessory2'

export const KITSUNE_SET_ITEMS = [
  KITSUNE_BITE,
  KITSUNE_GRACE,
  KITSUNE_VISION,
  KITSUNE_STEPS,
  KITSUNE_CHARM,
  KITSUNE_SOUL,
]

// Set bonuses
export const KITSUNE_SET_BONUSES = {
  2: { description: 'Fox Spirit (2 pieces): +10 Speed, +5 Luck', stats: { speed: 10, luck: 5 } },
  4: { description: 'Fox Cunning (4 pieces): +20 Speed, +15 Luck, +20 Magic Power', stats: { speed: 20, luck: 15, magicPower: 20 } },
  6: { description: 'Nine-Tailed Power (Full Set): +40 Speed, +30 Luck, +50 Magic Power, +30 Attack', stats: { speed: 40, luck: 30, magicPower: 50, attack: 30 } },
}

export const KITSUNE_SET_NAME = 'Kitsune'
