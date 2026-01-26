import type { Item } from '@/types'

/**
 * Base amulet template
 */
export const AMULET_BASE: Omit<Item, 'id' | 'name' | 'rarity' | 'value'> = {
  description: 'A protective amulet',
  type: 'accessory2',
  stats: {
    defense: 3,
    maxHp: 5,
  },
}
