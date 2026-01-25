import type { Item } from '@/types'

/**
 * Base staff template - magical weapon
 */
export const STAFF_BASE: Omit<Item, 'id' | 'name' | 'rarity' | 'value'> = {
  description: 'A mystical channeling weapon',
  type: 'weapon',
  icon: 'GiWizardStaff',
  stats: {
    attack: 8,
    magicPower: 5,
  },
}
