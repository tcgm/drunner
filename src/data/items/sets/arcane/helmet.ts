import { GiWizardFace } from 'react-icons/gi'
import type { Item } from '@/types'

/**
 * Arcane Circlet - Set helmet
 */
export const ARCANE_CIRCLET: Omit<Item, 'id'> = {
  name: "Arcane Circlet",
  description: 'A circlet that enhances mental acuity and magical focus.',
  type: 'helmet',
  rarity: 'epic',
  icon: GiWizardFace,
  stats: {
    wisdom: 50,
    magicPower: 40,
    charisma: 25,
  },
  value: 12000,
}
