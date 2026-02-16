import { GiCoffeeCup } from 'react-icons/gi'
import type { Item } from '@/types'

/**
 * Cocktail Tray - Bunny Set weapon
 * A silver serving tray used by casino bunny girls
 */
export const COCKTAIL_TRAY: Omit<Item, 'id'> = {
  name: "Cocktail Tray",
  description: 'A polished silver tray. Perfect for serving drinks... or dealing swift strikes.',
  type: 'weapon',
  rarity: 'rare',
  icon: GiCoffeeCup,
  stats: {
    attack: 45,
    speed: 35,
    charisma: 25,
    luck: 15,
  },
  value: 5000,
}
