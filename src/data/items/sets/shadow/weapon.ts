import { GiShadowFollower } from 'react-icons/gi'
import type { Item } from '@/types'

/**
 * Shadow's Edge - Set weapon
 */
export const SHADOWS_EDGE: Omit<Item, 'id'> = {
  name: "Shadow's Edge",
  description: 'A blade forged in pure darkness. Strikes from the shadows unseen.',
  type: 'weapon',
  rarity: 'epic',
  icon: GiShadowFollower,
  stats: {
    attack: 120,
    speed: 40,
    luck: 25,
  },
  value: 10000,
}
