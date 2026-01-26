import type { Item } from '@/types'

/**
 * Dragonheart Plate - Legendary dragon armor
 */
export const DRAGONHEART_PLATE: Omit<Item, 'id'> = {
  name: 'Dragonheart Plate',
  description: 'Forged from the scales of an ancient red dragon. Pulses with draconic power.',
  type: 'armor',
  rarity: 'legendary',
  stats: {
    defense: 100,
    maxHp: 120,
    attack: 30,
  },
  value: 12000,
}
