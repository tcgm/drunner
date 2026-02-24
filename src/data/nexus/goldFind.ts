import { GiTwoCoins } from 'react-icons/gi'
import type { NexusUpgrade } from './types'

export const GOLD_FIND: NexusUpgrade = {
  id: 'gold_find',
  name: 'Gilded Touch',
  description: 'Increases gold dropped by enemies.',
  icon: GiTwoCoins,
  category: 'fortune',
  baseCost: 100,
  bonusPerTier: 3,
  unit: '%',
  color: '#D4AF37',
}
