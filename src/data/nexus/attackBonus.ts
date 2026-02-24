import { GiSwordman } from 'react-icons/gi'
import type { NexusUpgrade } from './types'

export const ATTACK_BONUS: NexusUpgrade = {
  id: 'attack_bonus',
  name: 'Battle Hardened',
  description: "Permanently trains all heroes' attack.",
  icon: GiSwordman,
  category: 'combat',
  baseCost: 350,
  bonusPerTier: 1,
  unit: '',
  color: '#FC8181',
}
