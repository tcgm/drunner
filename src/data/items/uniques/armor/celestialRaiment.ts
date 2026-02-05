import type { Item } from '@/types'
import { GiPlanetCore } from 'react-icons/gi'

/**
 * Celestial Raiment - Mythic divine robes
 */
export const CELESTIAL_RAIMENT: Omit<Item, 'id'> = {
  name: 'Celestial Raiment',
  description: 'Robes woven from starlight by celestial beings. Radiates holy power.',
  type: 'armor',
  rarity: 'mythic',
  icon: GiPlanetCore,
  stats: {
    defense: 120,
    maxHp: 150,
    magicPower: 80,
    luck: 25,
  },
  value: 32000,
}
