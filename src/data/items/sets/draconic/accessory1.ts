import { GiDiamondRing } from 'react-icons/gi'
import type { Item } from '@/types'

/**
 * Draconic Heart - Set accessory
 */
export const DRACONIC_HEART: Omit<Item, 'id'> = {
  name: "Draconic Heart",
  description: 'A crystallized dragon heart. Pulses with ancient power.',
  type: 'accessory1',
  rarity: 'legendary',
  icon: GiDiamondRing,
  stats: {
    maxHp: 100,
    attack: 30,
    defense: 30,
  },
  value: 15000,
}
