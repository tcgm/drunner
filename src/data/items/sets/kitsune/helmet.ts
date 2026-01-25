import type { Item } from '@/types'

/**
 * Kitsune's Vision - Set helmet
 */
export const KITSUNE_VISION: Omit<Item, 'id'> = {
  name: "Kitsune's Vision",
  description: 'A mask resembling a fox spirit. Grants mystical perception and cunning.',
  type: 'helmet',
  rarity: 'set',
  stats: {
    defense: 45,
    magicPower: 35,
    luck: 20,
    speed: 15,
  },
  value: 7000,
}
