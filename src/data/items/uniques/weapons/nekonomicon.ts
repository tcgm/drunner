import { GiCat } from 'react-icons/gi'
import type { Item } from '@/types'

/**
 * Nekonomicon - Mythic book of feline charm and charisma
 */
export const NEKONOMICON: Omit<Item, 'id'> = {
  name: 'Nekonomicon',
  description: 'The Sacred Book of Cats. Contains ancient secrets of charm, grace, and overwhelming cuteness. Reading it grants the bearer irresistible charisma and the power to befriend anyone... or anything.',
  type: 'weapon',
  rarity: 'mythicc',
  icon: GiCat,
  stats: {
    attack: 30,
    magicPower: 120,
    charisma: 250,
    luck: 50,
  },
  value: 50000,
}
