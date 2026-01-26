import type { Item } from '@/types'

/**
 * Base vest template - light armor
 */
export const VEST_BASE: Omit<Item, 'id' | 'name' | 'rarity' | 'value'> = {
  description: 'Lightweight protective garment',
  type: 'armor',
  stats: {
    defense: 6,
    maxHp: 10,
  },
}
