import { GiCrystalBall } from 'react-icons/gi'
import type { NexusUpgrade } from './types'

export const ALKAHEST_YIELD: NexusUpgrade = {
  id: 'alkahest_yield',
  name: 'Alchemical Insight',
  description: 'More alkahest recovered from item scrapping.',
  icon: GiCrystalBall,
  category: 'fortune',
  maxTier: 4,
  bonusPerTier: 5,
  unit: '%',
  costs: [200, 600, 1500, 3500],
  color: '#7CDCE4',
}
