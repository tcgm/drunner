import type { Material } from '../index'
import { GiMagicSwirl } from 'react-icons/gi'

export const ENCHANTED: Material = {
  id: 'enchanted',
  name: 'Enchanted',
  prefix: 'Enchanted',
  rarity: 'rare',
  statMultiplier: 2.5,
  valueMultiplier: 6.0,
  description: 'Imbued with magical properties',
  icon: GiMagicSwirl,
}
