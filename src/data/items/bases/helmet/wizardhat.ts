import type { BaseItemTemplate } from '../index'

import magicHatIcon from '@/assets/icons/items/magicHat.svg'
import wizardHatIcon from '@/assets/icons/items/wizardHat.svg'
import witchHatIcon from '@/assets/icons/items/witchHat.svg'
import pilosHatIcon from '@/assets/icons/items/pilosHat.svg'

/**
 * Base wizard hat template - magical headgear for spellcasters
 */
export const WIZARD_HAT_BASE: BaseItemTemplate = {
  id: 'wizardhat',
  description: 'A tall pointed hat favored by spellcasters',
  type: 'helmet',
  icon: magicHatIcon,
  baseNames: ['Arcan', 'Conica', 'Pilos'],
  baseNameIcons: {
    'Magir': magicHatIcon,
    'Arcan': wizardHatIcon,
    'Conica': witchHatIcon,
    'Pilos': pilosHatIcon,
  },
  stats: {
    defense: 2,
    magicPower: 6,
    wisdom: 4,
  },
  materialBlacklist: ['iron', 'bronze', 'steel', 'mithril', 'adamantine'],
}
