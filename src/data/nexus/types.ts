import type { IconType } from 'react-icons'

export type NexusCategory = 'fortune' | 'combat' | 'resilience' | 'arcane'

export interface NexusUpgrade {
  id: string
  name: string
  description: string
  icon: IconType
  category: NexusCategory
  maxTier: number
  /** Flat bonus added per tier (cumulative) */
  bonusPerTier: number
  /** Display unit appended to the number in the UI, e.g. '%' or '' */
  unit: string
  /** Meta XP cost per tier: index 0 = cost to reach tier 1, index 1 = cost to reach tier 2, … */
  costs: number[]
  color: string
}
