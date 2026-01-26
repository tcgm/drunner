import type { Item } from '@/types'

/**
 * Base talisman template
 */
export const TALISMAN_BASE: Omit<Item, 'id' | 'name' | 'rarity' | 'value'> = {
  description: 'A mystical talisman',
  type: 'accessory2',
  stats: {
    attack: 3,
    magicPower: 3,
  },
}
