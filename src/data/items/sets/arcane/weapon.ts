import { GiWizardStaff } from 'react-icons/gi'
import type { Item } from '@/types'

/**
 * Arcane Conduit - Set weapon
 */
export const ARCANE_CONDUIT: Omit<Item, 'id'> = {
  name: "Arcane Conduit",
  description: 'A staff that channels raw magical energy. Crackles with arcane power.',
  type: 'weapon',
  rarity: 'epic',
  icon: GiWizardStaff,
  stats: {
    magicPower: 80,
    wisdom: 40,
    attack: 50,
  },
  value: 12000,
}
