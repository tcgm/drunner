import { GiMedal } from 'react-icons/gi'
import type { Item } from '@/types'

/**
 * Pendant of the Warrior - Epic strength amulet
 */
export const PENDANT_OF_THE_WARRIOR: Omit<Item, 'id'> = {
  name: 'Pendant of the Warrior',
  description: 'Contains the battle spirit of a legendary warrior. Grants overwhelming strength.',
  type: 'accessory2',
  rarity: 'epic',
  icon: GiMedal,
  stats: {
    attack: 45,
    maxHp: 50,
    defense: 25,
  },
  value: 4800,
}
