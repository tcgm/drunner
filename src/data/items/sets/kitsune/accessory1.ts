import { GiFoxTail } from 'react-icons/gi'
import type { Item } from '@/types'

/**
 * Kitsune's Charm - Set accessory (ring)
 */
export const KITSUNE_CHARM: Omit<Item, 'id'> = {
  name: "Kitsune's Charm",
  description: 'A ring containing a fragment of fox spirit essence. Brings fortune and tricks fate.',
  type: 'accessory1',
  rarity: 'set',
  icon: GiFoxTail,
  stats: {
    luck: 30,
    speed: 15,
    magicPower: 25,
  },
  value: 6500,
}
