import type { Item } from '@/types'

/**
 * Base chainmail template - medium armor
 */
export const CHAINMAIL_BASE: Omit<Item, 'id' | 'name' | 'rarity' | 'value'> = {
  description: 'Interlocking metal rings',
  type: 'armor',
  stats: {
    defense: 10,
    maxHp: 15,
    speed: -1,
  },
}
