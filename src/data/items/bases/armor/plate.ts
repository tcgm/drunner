import type { Item } from '@/types'

/**
 * Base plate armor template - heavy armor
 */
export const PLATE_ARMOR_BASE: Omit<Item, 'id' | 'name' | 'rarity' | 'value'> = {
  description: 'Heavy protective plating',
  type: 'armor',
  stats: {
    defense: 15,
    maxHp: 20,
    speed: -3,
  },
}
