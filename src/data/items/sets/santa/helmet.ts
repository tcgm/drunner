import santaHatIcon from '@/assets/icons/items/santaHat.svg'
import type { Item } from '@/types'

/**
 * Santa's Hat - Santa Set helmet
 */
export const SANTAS_HAT: Omit<Item, 'id'> = {
  name: "Santa's Hat",
  description: 'A bright red hat trimmed with white fluff. Those who wear it feel an inexplicable urge to laugh heartily.',
  type: 'helmet',
  rarity: 'rare',
  minRarity: 'uncommon',
  maxRarity: 'artifact',
  icon: santaHatIcon,
  stats: {
    defense: 20,
    luck: 30,
    charisma: 25,
  },
  value: 4500,
}
