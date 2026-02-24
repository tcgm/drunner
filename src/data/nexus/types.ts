import type { IconType } from 'react-icons'

export type NexusCategory = 'fortune' | 'combat' | 'resilience' | 'arcane'

export interface NexusUpgrade {
  id: string
  name: string
  description: string
  icon: IconType
  category: NexusCategory
  /**
   * Base Meta XP cost for tier 1 of the first (Common) rarity phase.
   * All other costs are derived from this via the curve config in GAME_CONFIG.nexus.
   */
  baseCost: number
  /** Flat stat bonus added per tier (cumulative across all rarity phases and tiers) */
  bonusPerTier: number
  /** Display unit appended to the number in the UI, e.g. '%' or '' */
  unit: string
  color: string
}
