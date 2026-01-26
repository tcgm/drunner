import type { Item } from '@/types'

/**
 * Heart of the Phoenix - Mythic rebirth charm
 */
export const HEART_OF_THE_PHOENIX: Omit<Item, 'id'> = {
  name: 'Heart of the Phoenix',
  description: 'The crystallized heart of an eternal phoenix. Burns with the fire of rebirth.',
  type: 'accessory1',
  rarity: 'mythic',
  stats: {
    maxHp: 200,
    defense: 60,
    magicPower: 70,
    luck: 35,
  },
  value: 27000,
}
