import { GiLightningStorm } from 'react-icons/gi'
import type { Item } from '@/types'

/**
 * Eye of the Storm - Legendary elemental talisman
 */
export const EYE_OF_THE_STORM: Omit<Item, 'id'> = {
  name: 'Eye of the Storm',
  description: 'A talisman containing a trapped lightning elemental. Crackles with raw power.',
  type: 'accessory2',
  rarity: 'legendary',
  minRarity: 'rare',
  maxRarity: 'mythicc',
  icon: GiLightningStorm,
  stats: {
    attack: 60,
    speed: 30,
    magicPower: 40,
    luck: 10,
  },
  value: 11500,
}
