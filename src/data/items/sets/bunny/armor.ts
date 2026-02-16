import { GiAmpleDress } from 'react-icons/gi'
import type { Item } from '@/types'

/**
 * Velvet Leotard - Bunny Set armor
 * The iconic bunny suit worn by casino showgirls
 */
export const VELVET_LEOTARD: Omit<Item, 'id'> = {
  name: "Velvet Leotard",
  description: 'A form-fitting velvet outfit that leaves little to the imagination. Confidence is the best armor.',
  type: 'armor',
  rarity: 'rare',
  icon: GiAmpleDress,
  stats: {
    defense: 35,
    speed: 30,
    charisma: 40,
    luck: 20,
  },
  value: 5000,
}
