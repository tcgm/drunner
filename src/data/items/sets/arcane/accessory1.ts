import { GiSpellBook } from 'react-icons/gi'
import type { Item } from '@/types'

/**
 * Arcane Tome - Set accessory
 */
export const ARCANE_TOME: Omit<Item, 'id'> = {
  name: "Arcane Tome",
  description: 'An ancient spellbook containing forgotten magical secrets.',
  type: 'accessory1',
  rarity: 'epic',
  icon: GiSpellBook,
  stats: {
    wisdom: 45,
    magicPower: 50,
    charisma: 15,
  },
  value: 12000,
}
