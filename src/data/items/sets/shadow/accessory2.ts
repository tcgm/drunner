import { GiMoon } from 'react-icons/gi'
import type { Item } from '@/types'

/**
 * Shadow's Heart - Set accessory
 */
export const SHADOWS_HEART: Omit<Item, 'id'> = {
  name: "Shadow's Heart",
  description: 'A dark gem that pulses with the essence of night. Empowers the wielder.',
  type: 'accessory2',
  rarity: 'epic',
  icon: GiMoon,
  stats: {
    speed: 35,
    luck: 35,
    attack: 30,
  },
  value: 10000,
}
