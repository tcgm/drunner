import { GiClover } from 'react-icons/gi'
import type { NexusUpgrade } from './types'

export const LUCK_BOOST: NexusUpgrade = {
  id: 'luck',
  name: 'Keen Fortune',
  description: "Raises all heroes' base Luck stat.",
  icon: GiClover,
  category: 'fortune',
  maxTier: 5,
  bonusPerTier: 1,
  unit: '',
  costs: [150, 400, 1000, 2400, 5500],
  color: '#48BB78',
}
