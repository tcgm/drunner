import { GiReaperScythe } from 'react-icons/gi'
import type { NexusUpgrade } from './types'

/**
 * Boss HP Reduction — most expensive Nexus upgrade.
 * 40 tiers × 1.875 bonusPerTier = 75% max boss HP reduction.
 */
export const BOSS_HP_REDUCTION: NexusUpgrade = {
  id: 'boss_hp_reduction',
  name: 'Colossus Bane',
  description: 'Permanently reduces the maximum HP of all bosses.',
  icon: GiReaperScythe,
  category: 'combat',
  baseCost: 500,
  bonusPerTier: 1.875,
  unit: '%',
  color: '#FC5454',
}
