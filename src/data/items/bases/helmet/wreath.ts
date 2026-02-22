import { GiPowerRing, GiOlive, GiLeafSwirl, GiImperialCrown, GiVineFlower, GiCrownOfThorns, GiLaurelCrown } from 'react-icons/gi'
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
    'Wreath': GiCrownOfThorns,
    'Laurel': GiLaurelCrown,
    'Garland': GiLeafSwirl,
  },
  stats: {
    defense: 1,
    charisma: 5,
    wisdom: 4,
    luck: 2,
  },
  materialBlacklist: ['iron', 'bronze', 'steel', 'mithril', 'adamantine'],
}
