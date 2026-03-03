import { GiPresent } from 'react-icons/gi'
import type { Item } from '@/types'

/**
 * Santa's Sack - Santa Set weapon
 * An impossibly full sack of gifts, swung with cheerful devastation
 */
export const SANTAS_SACK: Omit<Item, 'id'> = {
  name: "Santa's Sack",
  description: "A bottomless bag stuffed with presents. Swung like a flail, it hits with the weight of every gift inside — which is to say, all of them.",
  type: 'weapon',
  rarity: 'rare',
  minRarity: 'uncommon',
  maxRarity: 'artifact',
  icon: GiPresent,
  stats: {
    attack: 55,
    luck: 25,
    charisma: 20,
  },
  value: 5500,
}
