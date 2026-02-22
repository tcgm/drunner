import { GiFireWave } from 'react-icons/gi'
import type { Item } from '@/types'

/**
 * Staff of Eternal Flame - Legendary mage staff
 * Special ability: At combat start, 30% chance to surge magic power by 60% for the battle
 */
export const STAFF_OF_ETERNAL_FLAME: Omit<Item, 'id'> = {
  name: 'Staff of Eternal Flame',
  description: 'Carved from a tree struck by arcane lightning and set ablaze for a century. The flame at its tip never dies. Those who wield it feel their magical potential ignite.',
  type: 'weapon',
  rarity: 'legendary',
  minRarity: 'epic',
  maxRarity: 'divine',
  icon: GiFireWave,
  stats: {
    magicPower: 150,
    wisdom: 80,
    attack: 35,
    speed: 15,
  },
  value: 14000,
}
