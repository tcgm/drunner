import { GiRing } from 'react-icons/gi'
import type { BaseItemTemplate } from '../index'

/**
 * Base ring template
 */
export const RING_BASE: BaseItemTemplate = {
  id: 'ring',
  description: 'A magical ring',
  type: 'accessory1',
  icon: GiRing,
  baseNames: ['Ring', 'Band'],
  stats: {
    luck: 2,
  },
}
