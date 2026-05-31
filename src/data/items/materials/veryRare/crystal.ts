import type { Material } from '../index'
import { GiCrystalShine } from 'react-icons/gi'

export const CRYSTAL: Material = {
  id: 'crystal',
  name: 'Crystal',
  prefix: 'Crystal',
  rarity: 'veryRare',
  statMultiplier: 2.5,
  valueMultiplier: 8.0,
  description: 'Pure crystalline structure that channels energy',
  icon: GiCrystalShine,
}
