import { GiHeartPlus } from 'react-icons/gi'
import type { NexusUpgrade } from './types'

export const MAX_HP_BOOST: NexusUpgrade = {
  id: 'max_hp',
  name: 'Ironclad Constitution',
  description: 'Increases the maximum HP of all heroes.',
  icon: GiHeartPlus,
  category: 'resilience',
  baseCost: 120,
  bonusPerTier: 5,
  unit: '',
  color: '#68D391',
}
