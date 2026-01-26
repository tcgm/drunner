import type { Item } from '@/types'

/**
 * Base ring template
 */
export const RING_BASE: Omit<Item, 'id' | 'name' | 'rarity' | 'value'> = {
  description: 'A magical ring',
  type: 'accessory1',
  stats: {
    luck: 2,
  },
}
