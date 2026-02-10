import { GiWingedEmblem } from 'react-icons/gi'
import type { Item } from '@/types'

/**
 * Boots of the Wind Walker - Epic speed boots
 */
export const BOOTS_OF_WIND_WALKER: Omit<Item, 'id'> = {
  name: 'Boots of the Wind Walker',
  description: 'Each step feels like floating on air. Move with the grace of the wind itself.',
  type: 'boots',
  rarity: 'epic',
  minRarity: 'uncommon',
  maxRarity: 'mythic',
  icon: GiWingedEmblem,
  stats: {
    speed: 35,
    defense: 15,
    luck: 10,
  },
  value: 4000,
}
