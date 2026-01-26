import type { Item } from '@/types'

/**
 * Base sword template - will be combined with materials
 */
export const SWORD_BASE: Omit<Item, 'id' | 'name' | 'rarity' | 'value'> = {
  description: 'A balanced blade for close combat',
  type: 'weapon',
  stats: {
    attack: 10,
  },
}
