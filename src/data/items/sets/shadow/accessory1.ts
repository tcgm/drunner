import { GiShadowGrasp } from 'react-icons/gi'
import type { Item } from '@/types'

/**
 * Shadow's Touch - Set accessory
 */
export const SHADOWS_TOUCH: Omit<Item, 'id'> = {
  name: "Shadow's Touch",
  description: 'Gloves that allow manipulation of shadows themselves.',
  type: 'accessory',
  rarity: 'epic',
  icon: GiShadowGrasp,
  stats: {
    attack: 35,
    speed: 30,
    luck: 30,
  },
  value: 10000,
}
