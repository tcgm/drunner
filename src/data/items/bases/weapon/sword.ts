import { GiSwordsPower } from 'react-icons/gi'
import type { BaseItemTemplate } from '../index'

/**
 * Base sword template - will be combined with materials
 */
export const SWORD_BASE: BaseItemTemplate = {
  description: 'A balanced blade for close combat',
  type: 'weapon',
  icon: GiSwordsPower,
  baseNames: ['Sword', 'Blade'],
  stats: {
    attack: 10,
  },
}
