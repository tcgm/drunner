import { GiDragonHead } from 'react-icons/gi'
import type { Item } from '@/types'

/**
 * Draconic Crown - Set helmet
 */
export const DRACONIC_CROWN: Omit<Item, 'id'> = {
  name: "Draconic Crown",
  description: 'A crown shaped like a dragon\'s head. Grants the wearer draconic vision.',
  type: 'helmet',
  rarity: 'legendary',
  icon: GiDragonHead,
  stats: {
    defense: 60,
    wisdom: 30,
    maxHp: 40,
  },
  value: 15000,
}
