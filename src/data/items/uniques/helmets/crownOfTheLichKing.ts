import { GiCrownedSkull } from 'react-icons/gi'
import type { Item } from '@/types'

/**
 * Crown of the Lich King - Mythic necromantic crown
 */
export const CROWN_OF_THE_LICH_KING: Omit<Item, 'id'> = {
  name: 'Crown of the Lich King',
  description: 'A dark crown that radiates necrotic energy. Commands the power over life and death.',
  type: 'helmet',
  rarity: 'mythic',
  minRarity: 'epic',
  maxRarity: 'divine',
  icon: GiCrownedSkull,
  stats: {
    defense: 80,
    magicPower: 100,
    maxHp: -50, // Undeath curse
    attack: 40,
  },
  value: 20000,
}
