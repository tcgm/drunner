import santaSuitIcon from '@/assets/icons/items/santaSuit.svg'
import type { Item } from '@/types'

/**
 * Santa's Suit - Santa Set armor
 */
export const SANTAS_SUIT: Omit<Item, 'id'> = {
  name: "Santa's Suit",
  description: 'A legendary red coat of impossible warmth. Grants passage through any chimney and resistance to extreme cold.',
  type: 'armor',
  rarity: 'rare',
  minRarity: 'uncommon',
  maxRarity: 'artifact',
  icon: santaSuitIcon,
  stats: {
    defense: 55,
    maxHp: 60,
    charisma: 30,
  },
  value: 5500,
}
