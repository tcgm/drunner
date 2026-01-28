import type { Item } from '@/types'
import { GiShieldEchoes } from 'react-icons/gi'

/**
 * Aegis of the Immortal - Mythic divine shield armor
 */
export const AEGIS_OF_THE_IMMORTAL: Omit<Item, 'id'> = {
  name: 'Aegis of the Immortal',
  description: 'Armor blessed by the gods themselves. Legend says its wearer cannot fall in battle.',
  type: 'armor',
  rarity: 'mythic',
  icon: GiShieldEchoes,
  stats: {
    defense: 150,
    maxHp: 200,
    speed: -5,
    luck: 20,
  },
  value: 30000,
}
