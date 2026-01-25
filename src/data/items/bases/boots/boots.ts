import type { Item } from '@/types'

/**
 * Base boots template
 */
export const BOOTS_BASE: Omit<Item, 'id' | 'name' | 'rarity' | 'value'> = {
  description: 'Sturdy footwear',
  type: 'boots',
  icon: 'GiBoots',
  stats: {
    speed: 3,
    defense: 2,
  },
}
