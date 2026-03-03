import { GiHolySymbol } from 'react-icons/gi'
import type { Item } from '@/types'

/**
 * Diadem of Devotion - Epic cleric helmet
 * Special ability: After defeating a boss, heals the most wounded party member for 25% of their max HP
 */
export const DIADEM_OF_DEVOTION: Omit<Item, 'id'> = {
  name: 'Diadem of Devotion',
  description: "A sacred crown worn by high priests of the healing order. Its gemstones pulse with restorative light and glow faintly in the presence of the wounded, drawn instinctively toward suffering.",
  type: 'helmet',
  rarity: 'epic',
  minRarity: 'uncommon',
  maxRarity: 'artifact',
  icon: GiHolySymbol,
  stats: {
    wisdom: 80,
    magicPower: 55,
    defense: 35,
    maxHp: 80,
  },
  value: 5000,
}
