import { GiLayeredArmor } from 'react-icons/gi'
import type { BaseItemTemplate } from '../index'

/**
 * Base plate armor template - heavy armor
 */
export const PLATE_ARMOR_BASE: BaseItemTemplate = {
  description: 'Heavy protective plating',
  type: 'armor',
  icon: GiLayeredArmor,
  baseNames: ['Plate Armor', 'Plate Mail'],
  stats: {
    defense: 15,
    maxHp: 20,
    speed: -3,
  },
  materialBlacklist: ['leather', 'reinforced_leather'] // Metal plate, can't use leather
}
