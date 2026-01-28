import { GiBowArrow } from 'react-icons/gi'
import type { BaseItemTemplate } from '../index'

/**
 * Base bow template - ranged weapon
 */
export const BOW_BASE: BaseItemTemplate = {
  description: 'A ranged weapon for distance attacks',
  type: 'weapon',
  icon: GiBowArrow,
  baseNames: ['Bow'],
  stats: {
    attack: 9,
    speed: 2,
  },
}
