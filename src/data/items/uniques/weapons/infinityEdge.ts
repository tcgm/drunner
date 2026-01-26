import { GiCrystalWand } from 'react-icons/gi'
import type { Item } from '@/types'

/**
 * Infinity Edge - Mythic crystalline blade
 */
export const INFINITY_EDGE: Omit<Item, 'id'> = {
  name: 'Infinity Edge',
  description: 'A blade forged from crystallized time itself. Its edge cuts through reality.',
  type: 'weapon',
  rarity: 'mythic',
  icon: GiCrystalWand,
  stats: {
    attack: 180,
    speed: 35,
    defense: 40,
    luck: 20,
  },
  value: 28000,
}
