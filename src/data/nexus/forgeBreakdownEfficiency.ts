import { GiAnvil } from 'react-icons/gi'
import type { NexusUpgrade } from './types'

export const FORGE_BREAKDOWN_EFFICIENCY: NexusUpgrade = {
  id: 'forge_breakdown_efficiency',
  name: 'Smelter\'s Intuition',
  description: 'Items broken down at the Forge yield more material charge per piece.',
  icon: GiAnvil,
  category: 'fortune',
  baseCost: 50,
  bonusPerTier: 20,
  unit: '%',
  color: '#E07B1A',
}
