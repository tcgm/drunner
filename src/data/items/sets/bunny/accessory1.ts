import { GiBowTie } from 'react-icons/gi'
import type { Item } from '@/types'

/**
 * Bow Tie Collar - Bunny Set accessory
 * A classic bowtie collar
 */
export const BOW_TIE_COLLAR: Omit<Item, 'id'> = {
  name: "Bow Tie Collar",
  description: 'A charming black bowtie attached to a satin collar. Adds class to the ensemble.',
  type: 'accessory1',
  rarity: 'rare',
  minRarity: 'uncommon',
  maxRarity: 'artifact',
  icon: GiBowTie,
  stats: {
    speed: 15,
    charisma: 25,
    luck: 15,
  },
  value: 3500,
}
