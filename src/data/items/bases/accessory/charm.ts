import type { Item } from '@/types'

/**
 * Base charm template
 */
export const CHARM_BASE: Omit<Item, 'id' | 'name' | 'rarity' | 'value'> = {
  description: 'A lucky charm',
  type: 'accessory1',
  stats: {
    luck: 4,
    speed: 1,
  },
}
