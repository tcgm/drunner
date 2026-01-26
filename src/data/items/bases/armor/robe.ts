import type { Item } from '@/types'

/**
 * Base robe template - magical armor
 */
export const ROBE_BASE: Omit<Item, 'id' | 'name' | 'rarity' | 'value'> = {
  description: 'Flowing magical vestments',
  type: 'armor',
  stats: {
    defense: 4,
    maxHp: 8,
    magicPower: 5,
  },
}
