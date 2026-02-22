import { GiFlowerEarring, GiOlive, GiLeafSwirl } from 'react-icons/gi'
import type { BaseItemTemplate } from '../index'

/**
 * Base wreath template - natural headgear for leaders and scholars
 */
export const WREATH_BASE: BaseItemTemplate = {
  id: 'wreath',
  description: 'A woven circlet of leaves and flowers',
  type: 'helmet',
  icon: GiOlive,
  baseNames: ['Wreath', 'Laurel', 'Garland'],
  baseNameIcons: {
    'Wreath': GiLeafSwirl,
    'Laurel': GiOlive,
    'Garland': GiFlowerEarring,
  },
  stats: {
    defense: 1,
    charisma: 5,
    wisdom: 4,
    luck: 2,
  },
  materialBlacklist: ['iron', 'bronze', 'steel', 'mithril', 'adamantine'],
}
