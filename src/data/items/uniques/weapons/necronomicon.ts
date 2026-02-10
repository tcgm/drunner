import { GiEvilBook } from 'react-icons/gi'
import type { Item } from '@/types'

/**
 * Necronomicon - Mythic forbidden grimoire
 */
export const NECRONOMICON: Omit<Item, 'id'> = {
  name: 'Necronomicon',
  description: 'The Book of the Dead. Ancient forbidden knowledge written in blood. Those who read its pages risk madness... and power beyond mortal comprehension.',
  type: 'weapon',
  rarity: 'mythic',
  minRarity: 'epic',
  maxRarity: 'divine',
  icon: GiEvilBook,
  stats: {
    attack: 50,
    magicPower: 200,
    wisdom: 150,
    luck: -20, // Cursed
  },
  value: 50000,
  modifiers: ['cursed'],
}
