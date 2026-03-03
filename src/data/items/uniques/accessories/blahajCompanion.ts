import Shork from '@/assets/icons/items/Shork.svg'
import type { Item } from '@/types'

/**
 * Stuffed Shork - Beloved stuffed shark
 * A comforting blue shark plushie that brings joy and confidence
 */
export const BLAHAJ_COMPANION: Omit<Item, 'id'> = {
  name: 'Stuffed Shork',
  description: 'A soft blue shark plushie from a distant land. Its comforting presence brings courage, self-acceptance, and joy. Popular among those on journeys of self-discovery.',
  type: 'accessory1',
  rarity: 'legendary',
  minRarity: 'rare',
  maxRarity: 'artifact',
  icon: Shork,
  stats: {
    maxHp: 100,
    defense: 40,
    charisma: 60,
    wisdom: 50,
    luck: 40,
  },
  value: 15000,
}
