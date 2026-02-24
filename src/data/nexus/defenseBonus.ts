import { GiShield } from 'react-icons/gi'
import type { NexusUpgrade } from './types'

export const DEFENSE_BONUS: NexusUpgrade = {
  id: 'defense_bonus',
  name: 'Tempered Skin',
  description: "Raises all heroes' base Defense.",
  icon: GiShield,
  category: 'resilience',
  baseCost: 300,
  bonusPerTier: 1,
  unit: '',
  color: '#90CDF4',
}
