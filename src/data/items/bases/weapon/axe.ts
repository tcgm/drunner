import { GiBattleAxe } from 'react-icons/gi'
import type { BaseItemTemplate } from '../index'

/**
 * Base axe template - higher attack, slower
 */
export const AXE_BASE: BaseItemTemplate = {
  description: 'A heavy chopping weapon',
  type: 'weapon',
  icon: GiBattleAxe,
  stats: {
    attack: 12,
    speed: -2,
  },
}
