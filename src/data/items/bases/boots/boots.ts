import type { Item } from '@/types'

/**
 * Base boots template
 */
export const BOOTS_BASE: Omit<Item, 'id' | 'name' | 'rarity' | 'value'> = {
  description: 'Sturdy footwear',
  type: 'boots',
  stats: {
    speed: 3,
    defense: 2,
  },
}
