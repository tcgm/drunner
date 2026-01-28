import { GiFairyWand } from 'react-icons/gi'
import type { BaseItemTemplate } from '../index'

/**
 * Base wand/rod template - lighter magical weapon
 */
export const WAND_BASE: BaseItemTemplate = {
  description: 'A compact magical focus',
  type: 'weapon',
  icon: GiFairyWand,
  baseNames: ['Wand', 'Rod'],
  stats: {
    attack: 5,
    magicPower: 7,
  },
}
