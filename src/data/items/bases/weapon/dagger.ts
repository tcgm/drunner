import type { Item } from '@/types'

/**
 * Base dagger template - low attack, high speed
 */
export const DAGGER_BASE: Omit<Item, 'id' | 'name' | 'rarity' | 'value'> = {
  description: 'A quick stabbing weapon',
  type: 'weapon',
  stats: {
    attack: 6,
    speed: 4,
  },
}
