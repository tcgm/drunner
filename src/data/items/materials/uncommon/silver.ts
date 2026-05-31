import type { Material } from '../index'
import { GiSilverBullet } from 'react-icons/gi'

export const SILVER: Material = {
  id: 'silver',
  name: 'Silver',
  prefix: 'Silver',
  rarity: 'uncommon',
  statMultiplier: 1.6,
  valueMultiplier: 2.5,
  description: 'Blessed silver, effective against evil',
  icon: GiSilverBullet,
}
