import type { Item } from '@/types'

/**
 * Hermes' Sandals - Legendary winged boots
 */
export const HERMES_SANDALS: Omit<Item, 'id'> = {
  name: "Hermes' Sandals",
  description: 'Winged sandals of the messenger god. Grant supernatural swiftness to the wearer.',
  type: 'boots',
  rarity: 'legendary',
  stats: {
    speed: 50,
    defense: 20,
    luck: 15,
  },
  value: 9000,
}
