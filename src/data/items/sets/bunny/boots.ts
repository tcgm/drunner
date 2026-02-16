import { GiHighHeel } from 'react-icons/gi'
import type { Item } from '@/types'

/**
 * Stiletto Heels - Bunny Set boots
 * Sky-high heels that complete the bunny look
 */
export const STILETTO_HEELS: Omit<Item, 'id'> = {
  name: "Stiletto Heels",
  description: 'Six-inch heels that somehow make you faster. Dazzle and distract your foes.',
  type: 'boots',
  rarity: 'rare',
  icon: GiHighHeel,
  stats: {
    defense: 10,
    speed: 40,
    charisma: 35,
    luck: 10,
  },
  value: 4500,
}
