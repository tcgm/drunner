import type { Item } from '@/types'

/**
 * Base bow template - ranged weapon
 */
export const BOW_BASE: Omit<Item, 'id' | 'name' | 'rarity' | 'value'> = {
  description: 'A ranged weapon for distance attacks',
  type: 'weapon',
  stats: {
    attack: 9,
    speed: 2,
  },
}
