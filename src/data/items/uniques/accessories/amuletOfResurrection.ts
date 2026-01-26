import type { Item } from '@/types'

/**
 * Amulet of Resurrection - Legendary life-saving amulet
 */
export const AMULET_OF_RESURRECTION: Omit<Item, 'id'> = {
  name: 'Amulet of Resurrection',
  description: 'A golden amulet infused with phoenix essence. Grants a second chance at life.',
  type: 'accessory2',
  rarity: 'legendary',
  stats: {
    maxHp: 150,
    defense: 40,
    luck: 25,
  },
  value: 15000,
}
