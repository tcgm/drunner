import { GiChestArmor } from 'react-icons/gi'
import type { BaseItemTemplate } from '../index'

/**
 * Base chainmail template - medium armor
 */
export const CHAINMAIL_BASE: BaseItemTemplate = {
  description: 'Interlocking metal rings',
  type: 'armor',
  icon: GiChestArmor,
  stats: {
    defense: 10,
    maxHp: 15,
    speed: -1,
  },
  materialBlacklist: ['leather', 'reinforced_leather', 'dragonscale'] // Metal armor, can't use leather
}
