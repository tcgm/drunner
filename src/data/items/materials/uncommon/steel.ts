import type { Material } from '../index'
import { GiSteelClaws } from 'react-icons/gi'

export const STEEL: Material = {
  id: 'steel',
  name: 'Steel',
  prefix: 'Steel',
  rarity: 'uncommon',
  statMultiplier: 1.5,
  valueMultiplier: 2.0,
  description: 'High quality forged steel',
  icon: GiSteelClaws,
}
