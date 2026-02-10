import { GiShield } from 'react-icons/gi'
import type { Item } from '@/types'

/**
 * Titan's Bulwark - Epic titan armor
 */
export const TITANS_BULWARK: Omit<Item, 'id'> = {
  name: "Titan's Bulwark",
  description: 'Forged by ancient titans to withstand the clash of gods. Immovable defense.',
  type: 'armor',
  rarity: 'epic',
  minRarity: 'uncommon',
  maxRarity: 'mythic',
  icon: GiShield,
  stats: {
    defense: 70,
    maxHp: 100,
    speed: -10,
  },
  value: 4800,
}
