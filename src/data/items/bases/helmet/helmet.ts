import type { Item } from '@/types'

/**
 * Base helmet template
 */
export const HELMET_BASE: Omit<Item, 'id' | 'name' | 'rarity' | 'value'> = {
  description: 'Protective headgear',
  type: 'helmet',
  stats: {
    defense: 5,
    maxHp: 5,
  },
}
