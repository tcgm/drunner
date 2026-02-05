import { GiBootStomp } from 'react-icons/gi'
import type { Item } from '@/types'

/**
 * Arcane Treads - Set boots
 */
export const ARCANE_TREADS: Omit<Item, 'id'> = {
  name: "Arcane Treads",
  description: 'Boots that leave glowing magical runes with each step.',
  type: 'boots',
  rarity: 'epic',
  icon: GiBootStomp,
  stats: {
    speed: 30,
    magicPower: 35,
    wisdom: 20,
  },
  value: 12000,
}
