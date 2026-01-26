import type { Item } from '@/types'

/**
 * Charm of Infinite Fortune - Epic luck charm
 */
export const CHARM_OF_INFINITE_FORTUNE: Omit<Item, 'id'> = {
  name: 'Charm of Infinite Fortune',
  description: 'A four-leaf clover encased in crystal. Bends probability in your favor.',
  type: 'accessory1',
  rarity: 'epic',
  stats: {
    luck: 40,
    speed: 10,
  },
  value: 5000,
}
