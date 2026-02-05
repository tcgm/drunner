import { GiClawHammer } from 'react-icons/gi'
import type { Item } from '@/types'

/**
 * Draconic Talons - Set boots
 */
export const DRACONIC_TALONS: Omit<Item, 'id'> = {
  name: "Draconic Talons",
  description: 'Boots reinforced with dragon claws. Each step leaves scorched earth.',
  type: 'boots',
  rarity: 'legendary',
  icon: GiClawHammer,
  stats: {
    defense: 50,
    speed: 20,
    attack: 25,
  },
  value: 15000,
}
