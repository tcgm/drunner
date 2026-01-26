import { GiRobe } from 'react-icons/gi'
import type { BaseItemTemplate } from '../index'

/**
 * Base robe template - magical armor
 */
export const ROBE_BASE: BaseItemTemplate = {
  description: 'Flowing magical vestments',
  type: 'armor',
  icon: GiRobe,
  stats: {
    defense: 4,
    maxHp: 8,
    magicPower: 5,
  },
  materialBlacklist: ['iron', 'bronze', 'steel', 'mithril', 'adamantine'] // Cloth armor, can't use metal
}
