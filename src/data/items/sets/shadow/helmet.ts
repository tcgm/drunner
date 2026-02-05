import { GiNinjaMask } from 'react-icons/gi'
import type { Item } from '@/types'

/**
 * Shadow's Veil - Set helmet
 */
export const SHADOWS_VEIL: Omit<Item, 'id'> = {
  name: "Shadow's Veil",
  description: 'A mask that obscures the wearer in darkness. Enhances perception.',
  type: 'helmet',
  rarity: 'epic',
  icon: GiNinjaMask,
  stats: {
    defense: 40,
    speed: 30,
    wisdom: 25,
  },
  value: 10000,
}
