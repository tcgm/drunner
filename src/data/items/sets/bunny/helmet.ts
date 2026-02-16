import { GiRabbit } from 'react-icons/gi'
import type { Item } from '@/types'

/**
 * Satin Bunny Ears - Bunny Set helmet
 * The signature bunny ears headband
 */
export const SATIN_BUNNY_EARS: Omit<Item, 'id'> = {
  name: "Satin Bunny Ears",
  description: 'Perky satin ears on a velvet headband. Draws all eyes to you.',
  type: 'helmet',
  rarity: 'rare',
  icon: GiRabbit,
  stats: {
    defense: 15,
    speed: 25,
    charisma: 30,
    luck: 20,
  },
  value: 4500,
}
