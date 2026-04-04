import type { HeroSpecies, HeroStatBonus } from '@/types'

export interface SpeciesDefinition {
  id: HeroSpecies
  name: string
  description: string
  /** Flat stat bonuses granted to any hero of this species */
  statBonuses: Omit<HeroStatBonus, 'source'>[]
  /** Flavor adjectives for name generation */
  nameStyle: 'common' | 'elven' | 'dwarven' | 'orcish' | 'halfling' | 'gnomish' | 'infernal' | 'celestial'
}

export const SPECIES_DEFINITIONS: Record<HeroSpecies, SpeciesDefinition> = {
  human: {
    id: 'human',
    name: 'Human',
    description: 'Adaptable and resilient, humans excel in no single area but are limited in none.',
    statBonuses: [
      { stat: 'charisma', value: 2 },
      { stat: 'luck', value: 1 },
    ],
    nameStyle: 'common',
  },
  elf: {
    id: 'elf',
    name: 'Elf',
    description: 'Graceful and perceptive, elves have keen senses and affinity with magic.',
    statBonuses: [
      { stat: 'wisdom', value: 3 },
      { stat: 'speed', value: 2 },
    ],
    nameStyle: 'elven',
  },
  dwarf: {
    id: 'dwarf',
    name: 'Dwarf',
    description: 'Stout and enduring, dwarves are unmatched in toughness and stubborn resolve.',
    statBonuses: [
      { stat: 'defense', value: 3 },
      { stat: 'maxHp', value: 15 },
    ],
    nameStyle: 'dwarven',
  },
  orc: {
    id: 'orc',
    name: 'Orc',
    description: 'Ferocious and powerful, orcs hit harder than any other race.',
    statBonuses: [
      { stat: 'attack', value: 4 },
      { stat: 'defense', value: 1 },
    ],
    nameStyle: 'orcish',
  },
  halfling: {
    id: 'halfling',
    name: 'Halfling',
    description: 'Small and surprisingly lucky, halflings have an uncanny knack for avoiding disaster.',
    statBonuses: [
      { stat: 'luck', value: 4 },
      { stat: 'speed', value: 2 },
    ],
    nameStyle: 'halfling',
  },
  gnome: {
    id: 'gnome',
    name: 'Gnome',
    description: 'Clever and inventive, gnomes channel arcane energy with unusual efficiency.',
    statBonuses: [
      { stat: 'wisdom', value: 2 },
      { stat: 'luck', value: 2 },
    ],
    nameStyle: 'gnomish',
  },
  tiefling: {
    id: 'tiefling',
    name: 'Tiefling',
    description: 'Touched by infernal heritage, tieflings channel dark power with unnerving charm.',
    statBonuses: [
      { stat: 'charisma', value: 3 },
      { stat: 'wisdom', value: 2 },
    ],
    nameStyle: 'infernal',
  },
  aasimar: {
    id: 'aasimar',
    name: 'Aasimar',
    description: 'Blessed by divine ancestry, aasimar radiate power and inspire allies around them.',
    statBonuses: [
      { stat: 'charisma', value: 2 },
      { stat: 'maxHp', value: 10 },
      { stat: 'wisdom', value: 1 },
    ],
    nameStyle: 'celestial',
  },
}

export const ALL_SPECIES = Object.values(SPECIES_DEFINITIONS)
