import { GiMagicSwirl } from 'react-icons/gi'
import type { BaseItemTemplate } from '../index'

/**
 * Base talisman template
 */
export const TALISMAN_BASE: BaseItemTemplate = {
  id: 'talisman',
  description: 'A mystical talisman',
  type: 'accessory2',
  icon: GiMagicSwirl,
  baseNames: ['Talisman'],
  stats: {
    attack: 3,
    magicPower: 3,
  },
}
