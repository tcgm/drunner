import { GiBroadsword } from 'react-icons/gi'
import type { Item } from '@/types'

/**
 * Excalibur - Legendary holy sword
 */
export const EXCALIBUR: Omit<Item, 'id'> = {
  name: 'Excalibur',
  description: 'The legendary blade of kings, gleaming with divine light. Said to have been forged by ancient gods.',
  type: 'weapon',
  rarity: 'legendary',
  minRarity: 'rare',
  maxRarity: 'mythicc',
  icon: GiBroadsword,
  stats: {
    attack: 150,
    defense: 20,
    luck: 10,
  },
  value: 10000,
}
