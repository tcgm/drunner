import { GiCharm } from 'react-icons/gi'
import type { BaseItemTemplate } from '../index'

/**
 * Base charm template
 */
export const CHARM_BASE: BaseItemTemplate = {
  description: 'A lucky charm',
  type: 'accessory1',
  icon: GiCharm,
  baseNames: ['Charm'],
  stats: {
    luck: 4,
    speed: 1,
  },
}
