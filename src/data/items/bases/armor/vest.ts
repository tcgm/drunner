import { GiChestArmor } from 'react-icons/gi'
import type { BaseItemTemplate} from '../index'

/**
 * Base vest template - light armor
 */
export const VEST_BASE: BaseItemTemplate = {
  description: 'Lightweight protective garment',
  type: 'armor',
  icon: GiChestArmor,
  stats: {
    defense: 6,
    maxHp: 10,
  },
}
