import { GiFlangedMace, GiMaceHead } from 'react-icons/gi'
import type { Item } from '@/types'

/**
 * Dawnbreaker - Epic holy mace
 */
export const DAWNBREAKER: Omit<Item, 'id'> = {
  name: 'Dawnbreaker',
  description: 'A radiant mace that burns with the light of dawn, devastating to undead creatures.',
  type: 'weapon',
  rarity: 'epic',
  minRarity: 'uncommon',
  maxRarity: 'mythic',
  icon: GiFlangedMace,
  stats: {
    attack: 90,
    defense: 15,
    maxHp: 30,
  },
  value: 4500,
}
