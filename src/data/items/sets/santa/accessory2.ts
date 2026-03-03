import santaPantsIcon from '@/assets/icons/items/santaPants.svg'
import type { Item } from '@/types'

/**
 * Santa's Pants - Santa Set accessory
 */
export const SANTAS_PANTS: Omit<Item, 'id'> = {
  name: "Santa's Pants",
  description: "Sturdy red trousers held up by a magical belt. The pockets are rumoured to be bottomless.",
  type: 'accessory2',
  rarity: 'rare',
  minRarity: 'uncommon',
  maxRarity: 'artifact',
  icon: santaPantsIcon,
  stats: {
    defense: 30,
    maxHp: 40,
    speed: 15,
  },
  value: 3500,
}
