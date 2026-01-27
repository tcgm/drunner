import type { Item } from '@/types'
import { GiDragonHead } from 'react-icons/gi'

/**
 * Dragonheart Plate - Legendary dragon armor
 */
export const DRAGONHEART_PLATE: Omit<Item, 'id'> = {
  name: 'Dragonheart Plate',
  description: 'Forged from the scales of an ancient red dragon. Pulses with draconic power.',
  type: 'armor',
  rarity: 'legendary',
  icon: GiDragonHead,
  stats: {
    defense: 100,
    maxHp: 120,
    attack: 30,
  },
  value: 12000,
}
