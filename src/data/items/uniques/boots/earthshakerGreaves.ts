import { GiSpikedArmor } from 'react-icons/gi'
import type { Item } from '@/types'

/**
 * Earthshaker Greaves - Legendary titan boots
 */
export const EARTHSHAKER_GREAVES: Omit<Item, 'id'> = {
  name: 'Earthshaker Greaves',
  description: 'Boots that make the ground tremble with each step. Grants the strength of mountains.',
  type: 'boots',
  rarity: 'legendary',
  minRarity: 'rare',
  maxRarity: 'mythicc',
  icon: GiSpikedArmor,
  stats: {
    defense: 45,
    maxHp: 70,
    attack: 35,
    speed: -10,
  },
  value: 10000,
}
