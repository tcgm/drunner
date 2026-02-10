import { GiWingfoot } from 'react-icons/gi'
import type { Item } from '@/types'

/**
 * Hermes' Sandals - Legendary winged boots
 */
export const HERMES_SANDALS: Omit<Item, 'id'> = {
  name: "Hermes' Sandals",
  description: 'Winged sandals of the messenger god. Grant supernatural swiftness to the wearer.',
  type: 'boots',
  rarity: 'legendary',
  minRarity: 'rare',
  maxRarity: 'mythicc',
  icon: GiWingfoot,
  stats: {
    speed: 100,
    defense: 20,
    luck: 55,
  },
  value: 9000,
}
