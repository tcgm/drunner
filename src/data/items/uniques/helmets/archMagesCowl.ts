import { GiWizardFace } from 'react-icons/gi'
import type { Item } from '@/types'

import archmageCowlIcon from '@/assets/icons/items/archmageCowl.svg'

/**
 * Archmage's Cowl - Epic mage helmet
 * Suffused with centuries of concentrated arcane study.
 */
export const ARCHMAGES_COWL: Omit<Item, 'id'> = {
  name: "Archmage's Cowl",
  description: "The ceremonial hood of the High Archmage. Woven with enchanted silk and infused with condensed magical theory. It hums softly with residual spellwork.",
  type: 'helmet',
  rarity: 'epic',
  minRarity: 'uncommon',
  maxRarity: 'artifact',
  icon: archmageCowlIcon,
  stats: {
    magicPower: 90,
    wisdom: 55,
    defense: 20,
    maxHp: 50,
  },
  value: 5500,
}
