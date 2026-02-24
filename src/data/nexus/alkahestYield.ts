import { GiCrystalBall } from 'react-icons/gi'
import type { NexusUpgrade } from './types'

export const ALKAHEST_YIELD: NexusUpgrade = {
  id: 'alkahest_yield',
  name: 'Alchemical Insight',
  description: 'More alkahest recovered from item scrapping.',
  icon: GiCrystalBall,
  category: 'fortune',
  baseCost: 200,
  bonusPerTier: 5,
  unit: '%',
  color: '#7CDCE4',
}
