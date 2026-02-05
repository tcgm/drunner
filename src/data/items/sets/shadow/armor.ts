import { GiNinjaArmor } from 'react-icons/gi'
import type { Item } from '@/types'

/**
 * Shadow's Embrace - Set armor
 */
export const SHADOWS_EMBRACE: Omit<Item, 'id'> = {
  name: "Shadow's Embrace",
  description: 'Light armor woven from living shadows. Makes the wearer nearly invisible.',
  type: 'armor',
  rarity: 'epic',
  icon: GiNinjaArmor,
  stats: {
    defense: 60,
    speed: 35,
    luck: 20,
  },
  value: 10000,
}
