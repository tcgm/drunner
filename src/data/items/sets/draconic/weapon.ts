import { GiDragonBreath } from 'react-icons/gi'
import type { Item } from '@/types'

/**
 * Draconic Fang - Set weapon
 */
export const DRACONIC_FANG: Omit<Item, 'id'> = {
  name: "Draconic Fang",
  description: 'A weapon forged from an ancient dragon\'s fang. Radiates primordial fire.',
  type: 'weapon',
  rarity: 'legendary',
  icon: GiDragonBreath,
  stats: {
    attack: 140,
    defense: 20,
    maxHp: 50,
  },
  value: 15000,
}
