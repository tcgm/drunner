import { GiCircle, GiCrown, GiTiara } from 'react-icons/gi'
import type { BaseItemTemplate } from '../index'

/**
 * Base crown template - regal headpiece
 */
export const CROWN_BASE: BaseItemTemplate = {
  id: 'crown',
  description: 'A regal crown',
  type: 'helmet',
  icon: GiCrown,
  baseNames: ['Crown', 'Tiara', 'Circlet'],
  baseNameIcons: {
    'Crown': GiCrown,
    'Tiara': GiTiara,
    'Circlet': GiCircle
  },
  stats: {
    defense: 4,
    luck: 3,
  },
}
