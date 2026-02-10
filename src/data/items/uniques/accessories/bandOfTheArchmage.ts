import { GiGlobeRing } from 'react-icons/gi'
import type { Item } from '@/types'

/**
 * Band of the Archmage - Epic magic ring
 */
export const BAND_OF_THE_ARCHMAGE: Omit<Item, 'id'> = {
  name: 'Band of the Archmage',
  description: 'A ring worn by the greatest mages in history. Channels immense magical power.',
  type: 'accessory1',
  rarity: 'epic',
  minRarity: 'uncommon',
  maxRarity: 'mythic',
  icon: GiGlobeRing,
  stats: {
    magicPower: 50,
    defense: 20,
    maxHp: 30,
  },
  value: 5200,
}
