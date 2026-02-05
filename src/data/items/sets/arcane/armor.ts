import { GiMagicSwirl } from 'react-icons/gi'
import type { Item } from '@/types'

/**
 * Arcane Vestments - Set armor
 */
export const ARCANE_VESTMENTS: Omit<Item, 'id'> = {
  name: "Arcane Vestments",
  description: 'Robes inscribed with ancient runes. Enhances magical abilities.',
  type: 'armor',
  rarity: 'epic',
  icon: GiMagicSwirl,
  stats: {
    defense: 50,
    magicPower: 60,
    wisdom: 30,
    charisma: 20,
  },
  value: 12000,
}
