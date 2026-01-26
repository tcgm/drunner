import { GiKatana } from 'react-icons/gi'
import type { Item } from '@/types'

/**
 * Kitsune's Bite - Set weapon
 */
export const KITSUNE_BITE: Omit<Item, 'id'> = {
  name: "Kitsune's Bite",
  description: 'A blade forged by the nine-tailed fox spirits. Gleams with ethereal fox fire.',
  type: 'weapon',
  rarity: 'set',
  icon: GiKatana,
  stats: {
    attack: 110,
    speed: 30,
    luck: 15,
  },
  value: 8000,
}
