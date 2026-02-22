import santaBootsIcon from '@/assets/icons/items/santaBoots.svg'
import type { Item } from '@/types'

/**
 * Santa's Boots - Santa Set boots
 */
export const SANTAS_BOOTS: Omit<Item, 'id'> = {
  name: "Santa's Boots",
  description: 'Polished black boots that make no sound on rooftops. Said to grant the wearer the speed to circle the globe in a single night.',
  type: 'boots',
  rarity: 'rare',
  minRarity: 'uncommon',
  maxRarity: 'artifact',
  icon: santaBootsIcon,
  stats: {
    defense: 25,
    speed: 40,
    luck: 20,
  },
  value: 4500,
}
