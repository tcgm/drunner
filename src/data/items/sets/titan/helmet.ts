import { GiVisoredHelm } from 'react-icons/gi'
import type { Item } from '@/types'

/**
 * Titan's Crown - Set helmet
 */
export const TITANS_CROWN: Omit<Item, 'id'> = {
  name: "Titan's Crown",
  description: 'A helm worn by titan lords. Grants unwavering resolve.',
  type: 'helmet',
  rarity: 'legendary',
  icon: GiVisoredHelm,
  stats: {
    defense: 70,
    maxHp: 60,
    wisdom: 20,
  },
  value: 14000,
}
