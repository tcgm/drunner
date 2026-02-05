import { GiWarhammer } from 'react-icons/gi'
import type { Item } from '@/types'

/**
 * Titan's Wrath - Set weapon
 */
export const TITANS_WRATH: Omit<Item, 'id'> = {
  name: "Titan's Wrath",
  description: 'A colossal hammer forged by the ancient titans. Crushes all in its path.',
  type: 'weapon',
  rarity: 'legendary',
  icon: GiWarhammer,
  stats: {
    attack: 150,
    defense: 30,
    maxHp: 40,
  },
  value: 14000,
}
