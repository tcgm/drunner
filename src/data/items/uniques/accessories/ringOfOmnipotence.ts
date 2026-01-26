import { GiDiamondRing } from 'react-icons/gi'
import type { Item } from '@/types'

/**
 * Ring of Omnipotence - Mythic artifact ring
 */
export const RING_OF_OMNIPOTENCE: Omit<Item, 'id'> = {
  name: 'Ring of Omnipotence',
  description: 'One ring to rule them all. Contains the essence of ultimate power.',
  type: 'accessory1',
  rarity: 'mythic',
  icon: GiDiamondRing,
  stats: {
    attack: 80,
    defense: 80,
    speed: 30,
    luck: 30,
    maxHp: 100,
  },
  value: 50000,
}
