// Arcane set items
export * from './weapon'
export * from './armor'
export * from './helmet'
export * from './boots'
export * from './accessory1'
export * from './accessory2'

import { ARCANE_CONDUIT } from './weapon'
import { ARCANE_VESTMENTS } from './armor'
import { ARCANE_CIRCLET } from './helmet'
import { ARCANE_TREADS } from './boots'
import { ARCANE_TOME } from './accessory1'
import { ARCANE_ORB } from './accessory2'

export const ARCANE_SET_ITEMS = [
  ARCANE_CONDUIT,
  ARCANE_VESTMENTS,
  ARCANE_CIRCLET,
  ARCANE_TREADS,
  ARCANE_TOME,
  ARCANE_ORB,
]

// Set bonuses - emphasizing magic power, wisdom, and charisma
export const ARCANE_SET_BONUSES = {
  2: { description: 'Magical Affinity (2 pieces): +30 Magic Power, +20 Wisdom', stats: { magicPower: 30, wisdom: 20 } },
  4: { description: 'Arcane Mastery (4 pieces): +60 Magic Power, +40 Wisdom, +30 Charisma', stats: { magicPower: 60, wisdom: 40, charisma: 30 } },
  6: { description: 'Supreme Sorcery (Full Set): +120 Magic Power, +80 Wisdom, +60 Charisma, +20 Speed', stats: { magicPower: 120, wisdom: 80, charisma: 60, speed: 20 } },
}

export const ARCANE_SET_NAME = 'Arcane'
