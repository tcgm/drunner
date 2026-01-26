import type { Item } from '@/types'

/**
 * Visage of the Void - Mythic void helmet
 */
export const VISAGE_OF_THE_VOID: Omit<Item, 'id'> = {
  name: 'Visage of the Void',
  description: 'A helmet that exists partially outside reality. Looking into it reveals infinite darkness.',
  type: 'helmet',
  rarity: 'mythic',
  stats: {
    defense: 90,
    magicPower: 90,
    maxHp: 100,
    attack: 50,
  },
  value: 22000,
}
