import { GiBootStomp } from 'react-icons/gi'
import type { Item } from '@/types'

/**
 * Titan's Stride - Set boots
 */
export const TITANS_STRIDE: Omit<Item, 'id'> = {
  name: "Titan's Stride",
  description: 'Boots that shake the earth with each thunderous step.',
  type: 'boots',
  rarity: 'legendary',
  icon: GiBootStomp,
  stats: {
    defense: 60,
    maxHp: 50,
    attack: 30,
  },
  value: 14000,
}
