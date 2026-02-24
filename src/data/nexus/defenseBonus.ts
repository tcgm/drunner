import { GiShield } from 'react-icons/gi'
import type { NexusUpgrade } from './types'

export const DEFENSE_BONUS: NexusUpgrade = {
  id: 'defense_bonus',
  name: 'Tempered Skin',
  description: "Raises all heroes' base Defense.",
  icon: GiShield,
  category: 'resilience',
  maxTier: 4,
  bonusPerTier: 1,
  unit: '',
  costs: [300, 800, 2000, 5000],
  color: '#90CDF4',
}
