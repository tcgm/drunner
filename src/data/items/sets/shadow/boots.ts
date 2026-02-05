import { GiRunningNinja } from 'react-icons/gi'
import type { Item } from '@/types'

/**
 * Shadow's Whisper - Set boots
 */
export const SHADOWS_WHISPER: Omit<Item, 'id'> = {
  name: "Shadow's Whisper",
  description: 'Boots that make no sound. Walk through darkness undetected.',
  type: 'boots',
  rarity: 'epic',
  icon: GiRunningNinja,
  stats: {
    speed: 50,
    luck: 25,
    attack: 20,
  },
  value: 10000,
}
