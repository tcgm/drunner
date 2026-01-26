import type { Item } from '@/types'

/**
 * Base hood template - lighter headgear
 */
export const HOOD_BASE: Omit<Item, 'id' | 'name' | 'rarity' | 'value'> = {
  description: 'Cloth head covering',
  type: 'helmet',
  stats: {
    defense: 3,
    speed: 1,
  },
}
