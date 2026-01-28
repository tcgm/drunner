import { GiLightHelm } from 'react-icons/gi'
import type { BaseItemTemplate } from '../index'

/**
 * Base helmet template
 */
export const HELMET_BASE: BaseItemTemplate = {
  description: 'Protective headgear',
  type: 'helmet',
  icon: GiLightHelm,
  baseNames: ['Helmet', 'Helm'],
  stats: {
    defense: 5,
    maxHp: 5,
  },
}
