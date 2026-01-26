import type { Item } from '@/types'

/**
 * Base crown template - regal headpiece
 */
export const CROWN_BASE: Omit<Item, 'id' | 'name' | 'rarity' | 'value'> = {
  description: 'A regal crown',
  type: 'helmet',
  stats: {
    defense: 4,
    luck: 3,
  },
}
