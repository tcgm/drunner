/**
 * Unique hero definitions.
 * A unique hero can only appear on the board once per save
 * (they reappear only if previously dismissed without hiring).
 */

import type { HeroClass, HeroSpecies, HeroRarity, HeroStatBonus } from '@/types'

export interface UniqueHeroDefinition {
  /** Stable identifier — used to track if this unique was already hired/seen */
  id: string
  name: string
  species: HeroSpecies
  heroRarity: HeroRarity
  level: number
  /** Partial class override — if omitted a matching class is pulled from CORE_CLASSES by classId */
  classId: string
  statBonuses: Omit<HeroStatBonus, 'source'>[]
  hireCostOverride?: number
  /** Lore description shown on the card */
  lore?: string
}
