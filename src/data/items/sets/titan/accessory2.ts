import { GiShieldBash } from 'react-icons/gi'
import type { Item } from '@/types'

/**
 * Titan's Aegis - Set accessory
 */
export const TITANS_AEGIS: Omit<Item, 'id'> = {
  name: "Titan's Aegis",
  description: 'A shield fragment from the great titan war. Absorbs devastating blows.',
  type: 'accessory2',
  rarity: 'legendary',
  icon: GiShieldBash,
  stats: {
    defense: 60,
    maxHp: 70,
    attack: 20,
  },
  value: 14000,
}
