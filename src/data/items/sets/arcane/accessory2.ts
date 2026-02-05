import { GiCrystalBall } from 'react-icons/gi'
import type { Item } from '@/types'

/**
 * Arcane Orb - Set accessory
 */
export const ARCANE_ORB: Omit<Item, 'id'> = {
  name: "Arcane Orb",
  description: 'A sphere of pure magical energy. Amplifies all spellcasting.',
  type: 'accessory2',
  rarity: 'epic',
  icon: GiCrystalBall,
  stats: {
    magicPower: 70,
    wisdom: 35,
    charisma: 30,
  },
  value: 12000,
}
