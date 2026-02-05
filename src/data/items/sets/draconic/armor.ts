import { GiDragonOrb } from 'react-icons/gi'
import type { Item } from '@/types'

/**
 * Draconic Scales - Set armor
 */
export const DRACONIC_SCALES: Omit<Item, 'id'> = {
  name: "Draconic Scales",
  description: 'Armor plated with impenetrable dragon scales. Nearly indestructible.',
  type: 'armor',
  rarity: 'legendary',
  icon: GiDragonOrb,
  stats: {
    defense: 100,
    maxHp: 80,
    attack: 20,
  },
  value: 15000,
}
