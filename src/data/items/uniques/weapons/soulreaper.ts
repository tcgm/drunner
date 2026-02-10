import { GiScythe } from 'react-icons/gi'
import type { Item } from '@/types'

/**
 * Soulreaper - Legendary death scythe
 */
export const SOULREAPER: Omit<Item, 'id'> = {
  name: 'Soulreaper',
  description: 'A cursed scythe that harvests the essence of fallen foes. Each kill strengthens its wielder.',
  type: 'weapon',
  rarity: 'legendary',
  minRarity: 'rare',
  maxRarity: 'mythicc',
  icon: GiScythe,
  stats: {
    attack: 140,
    speed: 10,
    maxHp: 50,
    luck: 5,
  },
  value: 11000,
}
