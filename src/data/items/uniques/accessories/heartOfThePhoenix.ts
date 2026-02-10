import { GiEgyptianBird, GiHeartWings } from 'react-icons/gi'
import type { Item } from '@/types'
import { RaHeartOfThePhoenix } from '@/components/icons/RpgIcons'

/**
 * Heart of the Phoenix - Mythic rebirth charm
 * Special ability: Upon defeating a boss, resurrects a random dead party member with 50% HP
 */
export const HEART_OF_THE_PHOENIX: Omit<Item, 'id'> = {
  name: 'Heart of the Phoenix',
  description: 'The crystallized heart of an eternal phoenix. Burns with the fire of rebirth. Upon defeating a boss, its flames will resurrect a fallen ally.',
  type: 'accessory1',
  rarity: 'mythic',
  minRarity: 'epic',
  maxRarity: 'divine',
  icon: GiHeartWings,
  stats: {
    maxHp: 200,
    defense: 60,
    magicPower: 70,
    luck: 35,
  },
  value: 27000,
}
