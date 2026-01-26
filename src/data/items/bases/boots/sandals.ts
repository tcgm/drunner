import type { Item } from '@/types'

/**
 * Base sandals template - light footwear
 */
export const SANDALS_BASE: Omit<Item, 'id' | 'name' | 'rarity' | 'value'> = {
  description: 'Light open footwear',
  type: 'boots',
  stats: {
    speed: 5,
  },
}
