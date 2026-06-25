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
  /** react-icons/gi name, rendered full-size behind the hero's class icon */
  backgroundIcon?: string
  /** react-icons/gi name, rendered full-size in front of the hero's class icon */
  foregroundIcon?: string
}
