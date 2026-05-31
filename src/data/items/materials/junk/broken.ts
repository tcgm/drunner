import type { Material } from '../index'
import { GiBrokenBone } from 'react-icons/gi'

export const BROKEN: Material = {
  id: 'broken',
  name: 'Broken',
  prefix: 'Broken',
  rarity: 'junk',
  statMultiplier: 0.6,
  valueMultiplier: 0.4,
  description: 'Damaged and cracked',
  icon: GiBrokenBone,
}
