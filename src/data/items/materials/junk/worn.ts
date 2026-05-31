import type { Material } from '../index'
import { GiDustCloud } from 'react-icons/gi'

export const WORN: Material = {
  id: 'worn',
  name: 'Worn',
  prefix: 'Worn',
  rarity: 'junk',
  statMultiplier: 0.7,
  valueMultiplier: 0.5,
  description: 'Heavily used and faded',
  icon: GiDustCloud,
}
