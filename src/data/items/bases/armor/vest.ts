import { GiChestArmor } from 'react-icons/gi'
import type { BaseItemTemplate} from '../index'

/**
 * Base vest template - light armor
 */
export const VEST_BASE: BaseItemTemplate = {
  id: 'vest',
  description: 'Lightweight protective garment',
  type: 'armor',
  icon: GiChestArmor,
  baseNames: ['Vest', 'Tunic'],
  stats: {
    defense: 6,
    maxHp: 10,
  },
}
