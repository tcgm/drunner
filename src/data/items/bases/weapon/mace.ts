import type { Item } from '@/types'

/**
 * Base mace template - blunt weapon
 */
export const MACE_BASE: Omit<Item, 'id' | 'name' | 'rarity' | 'value'> = {
  description: 'A crushing bludgeoning weapon',
  type: 'weapon',
  icon: 'GiMace',
  stats: {
    attack: 11,
    defense: 2,
  },
}
