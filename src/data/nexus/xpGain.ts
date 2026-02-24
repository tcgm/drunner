import { GiStarfighter } from 'react-icons/gi'
import type { NexusUpgrade } from './types'

export const XP_GAIN: NexusUpgrade = {
  id: 'xp_gain',
  name: "Veteran's Spirit",
  description: 'All heroes earn more XP from combat and events.',
  icon: GiStarfighter,
  category: 'combat',
  maxTier: 5,
  bonusPerTier: 2,
  unit: '%',
  costs: [100, 280, 700, 1700, 4000],
  color: '#ECC94B',
}
