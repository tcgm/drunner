import type { HeroSpecies, HeroStatBonus, HeroRarity } from '@/types'

export type NameStyle =
  | 'common'
  | 'elven'
  | 'dwarven'
  | 'orcish'
  | 'halfling'
  | 'gnomish'
  | 'infernal'
  | 'celestial'
  | 'sylvan'
  | 'draconic'
  | 'yokai'

export interface SpeciesDefinition {
  id: HeroSpecies
  name: string
  description: string
  statBonuses: Omit<HeroStatBonus, 'source'>[]
  nameStyle: NameStyle
  /** Minimum hero rarity required for this species to appear on the board */
  spawnRarity: HeroRarity
  /** react-icons/gi name, rendered full-size behind the hero's class icon. Ignored if backgroundImage is set. */
  backgroundIcon?: string
  /** react-icons/gi name, rendered full-size in front of the hero's class icon. Ignored if foregroundImage is set. */
  foregroundIcon?: string
  /** Custom art asset (imported SVG/PNG url), rendered full-size behind the hero's class icon. Takes priority over backgroundIcon. */
  backgroundImage?: string
  /** Pan (% of box, can be negative) and zoom for backgroundImage. Used when the hero's class has no entry in backgroundOffsetsByClass. */
  backgroundOffset?: IconOffset
  /** Per-class override of backgroundOffset, keyed by HeroClass.id - different class icons need different background framing */
  backgroundOffsetsByClass?: Record<string, IconOffset>
  /** Custom art asset (imported SVG/PNG url), rendered full-size in front of the hero's class icon. Takes priority over foregroundIcon. */
  foregroundImage?: string
  /** Pan (% of box, can be negative) and zoom for foregroundImage. Used when the hero's class has no entry in foregroundOffsetsByClass. */
  foregroundOffset?: IconOffset
  /** Per-class override of foregroundOffset, keyed by HeroClass.id - different class icons need different foreground framing */
  foregroundOffsetsByClass?: Record<string, IconOffset>
}

export interface IconOffset {
  x: number
  y: number
  scale: number
}
