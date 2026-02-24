import { GiTwoCoins } from 'react-icons/gi'
import type { NexusUpgrade } from './types'

export const GOLD_FIND: NexusUpgrade = {
  id: 'gold_find',
  name: 'Gilded Touch',
  description: 'Increases gold dropped by enemies.',
  icon: GiTwoCoins,
  category: 'fortune',
  maxTier: 5,
  bonusPerTier: 3,
  unit: '%',
  costs: [100, 300, 750, 1800, 4200],
  color: '#D4AF37',
}
