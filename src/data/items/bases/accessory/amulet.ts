import { GiGemNecklace } from 'react-icons/gi'
import type { BaseItemTemplate } from '../index'

/**
 * Base amulet template
 */
export const AMULET_BASE: BaseItemTemplate = {
  description: 'A protective amulet',
  type: 'accessory2',
  icon: GiGemNecklace,
  stats: {
    defense: 3,
    maxHp: 5,
  },
}
