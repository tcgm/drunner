import type { Item } from '@/types'

/**
 * Kitsune's Grace - Set armor
 */
export const KITSUNE_GRACE: Omit<Item, 'id'> = {
  name: "Kitsune's Grace",
  description: 'Ethereal robes woven from fox spirit tails. Shimmers with illusion magic.',
  type: 'armor',
  rarity: 'set',
  stats: {
    defense: 70,
    speed: 25,
    magicPower: 40,
    luck: 15,
  },
  value: 8000,
}
