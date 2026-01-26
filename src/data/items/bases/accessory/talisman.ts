import { GiSpellBook } from 'react-icons/gi'
import type { BaseItemTemplate } from '../index'

/**
 * Base talisman template
 */
export const TALISMAN_BASE: BaseItemTemplate = {
  description: 'A mystical talisman',
  type: 'accessory2',
  icon: GiSpellBook,
  stats: {
    attack: 3,
    magicPower: 3,
  },
}
