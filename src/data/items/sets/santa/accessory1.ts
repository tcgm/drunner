import santaMittensIcon from '@/assets/icons/items/santaMittens.svg'
import type { Item } from '@/types'

/**
 * Santa's Mittens - Santa Set accessory
 */
export const SANTAS_MITTENS: Omit<Item, 'id'> = {
  name: "Santa's Mittens",
  description: 'Thick velvet mittens enchanted to deliver presents — and punches — with festive force.',
  type: 'accessory1',
  rarity: 'rare',
  minRarity: 'uncommon',
  maxRarity: 'artifact',
  icon: santaMittensIcon,
  stats: {
    attack: 30,
    charisma: 20,
    luck: 15,
  },
  value: 3500,
}
