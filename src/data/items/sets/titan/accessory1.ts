import { GiGauntlet } from 'react-icons/gi'
import type { Item } from '@/types'

/**
 * Titan's Fist - Set accessory
 */
export const TITANS_FIST: Omit<Item, 'id'> = {
  name: "Titan's Fist",
  description: 'Gauntlets imbued with titanic strength. Crushes stone effortlessly.',
  type: 'accessory1',
  rarity: 'legendary',
  icon: GiGauntlet,
  stats: {
    attack: 50,
    defense: 40,
    maxHp: 50,
  },
  value: 14000,
}
