import { GiLegArmor } from 'react-icons/gi'
import type { BaseItemTemplate } from '../index'

/**
 * Base greaves template - armored boots
 */
export const GREAVES_BASE: BaseItemTemplate = {
  description: 'Heavy armored leg protection',
  type: 'boots',
  icon: GiLegArmor,
  baseNames: ['Greaves'],
  stats: {
    speed: 1,
    defense: 5,
    maxHp: 5,
  },
  materialBlacklist: ['leather', 'reinforced_leather'] // Metal greaves, can't use leather
}
