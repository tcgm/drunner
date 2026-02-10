import { GiBrain } from 'react-icons/gi'
import type { Item } from '@/types'

/**
 * Mind Breaker - Epic psychic helmet
 */
export const MIND_BREAKER: Omit<Item, 'id'> = {
  name: 'Mind Breaker',
  description: 'A helmet that amplifies mental prowess but fragments sanity. Power at a cost.',
  type: 'helmet',
  rarity: 'epic',
  minRarity: 'uncommon',
  maxRarity: 'mythic',
  icon: GiBrain,
  stats: {
    magicPower: 60,
    attack: 30,
    defense: -10, // Reduced physical protection
    speed: 15,
  },
  value: 4200,
}
