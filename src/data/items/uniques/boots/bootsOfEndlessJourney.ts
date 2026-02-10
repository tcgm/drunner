import { GiHighHeel } from 'react-icons/gi'
import type { Item } from '@/types'

/**
 * Boots of Endless Journey - Mythic traveler boots
 */
export const BOOTS_OF_ENDLESS_JOURNEY: Omit<Item, 'id'> = {
  name: 'Boots of Endless Journey',
  description: 'These boots have walked across countless worlds and dimensions. They never tire.',
  type: 'boots',
  rarity: 'mythic',
  minRarity: 'epic',
  maxRarity: 'divine',
  icon: GiHighHeel,
  stats: {
    speed: 60,
    defense: 50,
    maxHp: 80,
    luck: 25,
  },
  value: 24000,
}
