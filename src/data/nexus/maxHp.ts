import { GiHeartPlus } from 'react-icons/gi'
import type { NexusUpgrade } from './types'

export const MAX_HP_BOOST: NexusUpgrade = {
  id: 'max_hp',
  name: 'Ironclad Constitution',
  description: 'Increases the maximum HP of all heroes.',
  icon: GiHeartPlus,
  category: 'resilience',
  maxTier: 5,
  bonusPerTier: 5,
  unit: '',
  costs: [120, 350, 850, 2000, 4800],
  color: '#68D391',
}
