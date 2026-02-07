import { GiBoots } from 'react-icons/gi'
import type { BaseItemTemplate } from '../index'

/**
 * Base boots template
 */
export const BOOTS_BASE: BaseItemTemplate = {
  id: 'boots',
  description: 'Sturdy footwear',
  type: 'boots',
  icon: GiBoots,
  baseNames: ['Boots'],
  stats: {
    speed: 3,
    defense: 2,
  },
}
