import { GiFireGem } from 'react-icons/gi'
import type { Item } from '@/types'

/**
 * Draconic Soul - Set accessory
 */
export const DRACONIC_SOUL: Omit<Item, 'id'> = {
  name: "Draconic Soul",
  description: 'Contains a fragment of a dragon\'s eternal soul. Burns with inner fire.',
  type: 'accessory2',
  rarity: 'legendary',
  icon: GiFireGem,
  stats: {
    magicPower: 60,
    wisdom: 40,
    maxHp: 60,
  },
  value: 15000,
}
