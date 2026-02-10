import { GiAnkh } from 'react-icons/gi'
import type { Item } from '@/types'

/**
 * Amulet of Resurrection - Legendary life-saving amulet
 */
export const AMULET_OF_RESURRECTION: Omit<Item, 'id'> = {
  name: 'Amulet of Resurrection',
  description: 'A golden amulet infused with phoenix essence. If the wearer dies, the amulet shatters to revive them at the start of the next event.',
  type: 'accessory2',
  rarity: 'legendary',
  minRarity: 'rare',
  maxRarity: 'mythicc',
  icon: GiAnkh,
  stats: {
    maxHp: 150,
    defense: 40,
    luck: 25,
  },
  value: 15000,
}
