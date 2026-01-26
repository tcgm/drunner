import type { Item } from '@/types'

/**
 * Base axe template - higher attack, slower
 */
export const AXE_BASE: Omit<Item, 'id' | 'name' | 'rarity' | 'value'> = {
  description: 'A heavy chopping weapon',
  type: 'weapon',
  stats: {
    attack: 12,
    speed: -2,
  },
}
