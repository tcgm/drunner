import { GiFeather } from 'react-icons/gi'
import type { Item } from '@/types'

/**
 * Fluffy Tail - Bunny Set accessory
 * The iconic bunny tail
 */
export const FLUFFY_TAIL: Omit<Item, 'id'> = {
  name: "Fluffy Tail",
  description: 'A soft, fluffy cottontail. Impossibly adorable and alluring.',
  type: 'accessory2',
  rarity: 'rare',
  icon: GiFeather,
  stats: {
    speed: 20,
    charisma: 30,
    luck: 20,
  },
  value: 3500,
}
