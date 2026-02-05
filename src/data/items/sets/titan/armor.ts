import { GiFullMetalBucketHandle } from 'react-icons/gi'
import type { Item } from '@/types'

/**
 * Titan's Bulwark - Set armor
 */
export const TITANS_BULWARK: Omit<Item, 'id'> = {
  name: "Titan's Bulwark",
  description: 'Armor carved from living stone. Immovable as a mountain.',
  type: 'armor',
  rarity: 'legendary',
  icon: GiFullMetalBucketHandle,
  stats: {
    defense: 110,
    maxHp: 100,
    attack: 20,
  },
  value: 14000,
}
