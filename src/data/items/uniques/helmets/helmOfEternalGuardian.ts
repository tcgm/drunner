import type { Item } from '@/types'

/**
 * Helm of the Eternal Guardian - Legendary protective helm
 */
export const HELM_OF_ETERNAL_GUARDIAN: Omit<Item, 'id'> = {
  name: 'Helm of the Eternal Guardian',
  description: 'Worn by the legendary guardian who never fell. Grants unwavering protection.',
  type: 'helmet',
  rarity: 'legendary',
  stats: {
    defense: 60,
    maxHp: 80,
    luck: 15,
    speed: -5,
  },
  value: 9500,
}
