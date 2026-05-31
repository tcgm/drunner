import type { Material } from '../index'
import { GiRustySword } from 'react-icons/gi'

export const RUSTY: Material = {
  id: 'rusty',
  name: 'Rusty',
  prefix: 'Rusty',
  rarity: 'junk',
  statMultiplier: 0.5,
  valueMultiplier: 0.3,
  description: 'Worn and corroded',
  icon: GiRustySword,
}
