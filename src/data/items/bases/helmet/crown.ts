import { GiCrown } from 'react-icons/gi'
import type { BaseItemTemplate } from '../index'

/**
 * Base crown template - regal headpiece
 */
export const CROWN_BASE: BaseItemTemplate = {
  description: 'A regal crown',
  type: 'helmet',
  icon: GiCrown,
  baseNames: ['Crown'],
  stats: {
    defense: 4,
    luck: 3,
  },
}
