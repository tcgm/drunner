import type { Item } from '@/types'

/**
 * Kitsune's Steps - Set boots
 */
export const KITSUNE_STEPS: Omit<Item, 'id'> = {
  name: "Kitsune's Steps",
  description: 'Boots blessed by fox spirits. Leave phantom afterimages with each stride.',
  type: 'boots',
  rarity: 'set',
  stats: {
    speed: 40,
    defense: 30,
    luck: 20,
  },
  value: 7000,
}
