import { GiMagicHat, GiPointyHat, GiDunceCap } from 'react-icons/gi'
import type { BaseItemTemplate } from '../index'

/**
 * Base wizard hat template - magical headgear for spellcasters
 */
export const WIZARD_HAT_BASE: BaseItemTemplate = {
  id: 'wizardhat',
  description: 'A tall pointed hat favored by spellcasters',
  type: 'helmet',
  icon: GiMagicHat,
  baseNames: ['Arcan', 'Conica', 'Pilos'],
  baseNameIcons: {
    'Arcan': GiMagicHat,
    'Conica': GiPointyHat,
    'Pilos': GiDunceCap,
  },
  stats: {
    defense: 2,
    magicPower: 6,
    wisdom: 4,
  },
  materialBlacklist: ['iron', 'bronze', 'steel', 'mithril', 'adamantine'],
}
