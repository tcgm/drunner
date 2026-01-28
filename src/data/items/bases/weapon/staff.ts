import { GiWizardStaff } from 'react-icons/gi'
import type { BaseItemTemplate } from '../index'

/**
 * Base staff template - magical weapon
 */
export const STAFF_BASE: BaseItemTemplate = {
  description: 'A mystical channeling weapon',
  type: 'weapon',
  icon: GiWizardStaff,
  baseNames: ['Staff', 'Stave'],
  stats: {
    attack: 8,
    magicPower: 5,
  },
}
