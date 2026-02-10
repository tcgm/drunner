import { GiRuneSword } from 'react-icons/gi'
import type { Item } from '@/types'

/**
 * Frostmourne - Mythic cursed runeblade
 */
export const FROSTMOURNE: Omit<Item, 'id'> = {
  name: 'Frostmourne',
  description: 'A cursed runeblade that hungers for souls. Its frozen surface chills the very air around it.',
  type: 'weapon',
  rarity: 'mythic',
  minRarity: 'epic',
  maxRarity: 'divine',
  icon: GiRuneSword,
  stats: {
    attack: 200,
    speed: 15,
    maxHp: -20, // Soul drain
    luck: 15,
  },
  value: 25000,
}
