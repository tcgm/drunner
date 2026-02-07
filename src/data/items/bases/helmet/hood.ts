import { GiHood } from 'react-icons/gi'
import type { BaseItemTemplate } from '../index'

/**
 * Base hood template - lighter headgear
 */
export const HOOD_BASE: BaseItemTemplate = {
  id: 'hood',
  description: 'Cloth head covering',
  type: 'helmet',
  icon: GiHood,
  baseNames: ['Hood', 'Cowl'],
  stats: {
    defense: 3,
    speed: 1,
  },
  materialBlacklist: ['iron', 'bronze', 'steel', 'mithril', 'adamantine'] // Cloth hood, can't use metal
}
