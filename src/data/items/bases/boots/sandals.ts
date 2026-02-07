import { GiSandal } from 'react-icons/gi'
import type { BaseItemTemplate } from '../index'

/**
 * Base sandals template - light footwear
 */
export const SANDALS_BASE: BaseItemTemplate = {
  id: 'sandals',
  description: 'Light open footwear',
  type: 'boots',
  icon: GiSandal,
  baseNames: ['Sandals'],
  stats: {
    speed: 5,
  },
  materialBlacklist: ['iron', 'bronze', 'steel', 'mithril', 'adamantine'] // Light footwear, can't use metal
}
