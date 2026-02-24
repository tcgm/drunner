import { GiSwordman } from 'react-icons/gi'
import type { NexusUpgrade } from './types'

export const ATTACK_BONUS: NexusUpgrade = {
  id: 'attack_bonus',
  name: 'Battle Hardened',
  description: "Permanently trains all heroes' attack.",
  icon: GiSwordman,
  category: 'combat',
  maxTier: 4,
  bonusPerTier: 1,
  unit: '',
  costs: [350, 900, 2200, 5500],
  color: '#FC8181',
}
