import { GiMusicalScore } from 'react-icons/gi'
import type { Item } from '@/types'

/**
 * Lyre of the Ancients - Legendary bard weapon
 * Special ability: At combat start, 35% chance to perform an inspiring melody that heals each party member for 8% of their max HP
 */
export const LYRE_OF_THE_ANCIENTS: Omit<Item, 'id'> = {
  name: 'Lyre of the Ancients',
  description: "Strings spun from moonlight and a frame carved from the World Tree's heartwood. Every note played resonates through the souls of allies, mending wounds the body has long forgotten.",
  type: 'weapon',
  rarity: 'legendary',
  minRarity: 'epic',
  maxRarity: 'divine',
  icon: GiMusicalScore,
  stats: {
    charisma: 130,
    magicPower: 60,
    luck: 50,
    attack: 15,
    speed: 20,
  },
  value: 13000,
}
