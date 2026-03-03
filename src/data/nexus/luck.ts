import { GiClover } from 'react-icons/gi'
import type { NexusUpgrade } from './types'

export const LUCK_BOOST: NexusUpgrade = {
  id: 'luck',
  name: 'Keen Fortune',
  description: "Raises all heroes' base Luck stat.",
  icon: GiClover,
  category: 'fortune',
  baseCost: 150,
  bonusPerTier: 1,
  unit: '',
  color: '#48BB78',
}
