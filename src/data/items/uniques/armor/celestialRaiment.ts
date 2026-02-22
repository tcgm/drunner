import type { Item } from '@/types'
import { GiPlanetCore } from 'react-icons/gi'

import celestialRaimentSvg from '@/assets/icons/items/celestialRaiment.svg'

/**
 * Celestial Raiment - Mythic divine robes
 */
export const CELESTIAL_RAIMENT: Omit<Item, 'id'> = {
  name: 'Celestial Raiment',
  description: 'Robes woven from starlight by celestial beings. Radiates holy power.',
  type: 'armor',
  rarity: 'mythic',
  minRarity: 'epic',
  maxRarity: 'divine',
  icon: celestialRaimentSvg,
  stats: {
    defense: 120,
    maxHp: 150,
    magicPower: 80,
    luck: 25,
  },
  value: 32000,
}
