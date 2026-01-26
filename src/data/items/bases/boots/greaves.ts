import type { Item } from '@/types'

/**
 * Base greaves template - armored boots
 */
export const GREAVES_BASE: Omit<Item, 'id' | 'name' | 'rarity' | 'value'> = {
  description: 'Heavy armored leg protection',
  type: 'boots',
  stats: {
    speed: 1,
    defense: 5,
    maxHp: 5,
  },
}
