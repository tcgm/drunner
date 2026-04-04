export type { SpeciesDefinition, NameStyle } from './_types'

import type { HeroSpecies } from '@/types'
import type { SpeciesDefinition } from './_types'

import { human } from './human'
import { elf } from './elf'
import { dwarf } from './dwarf'
import { orc } from './orc'
import { halfling } from './halfling'
import { gnome } from './gnome'
import { hellborn } from './hellborn'
import { celestine } from './celestine'
import { fae } from './fae'
import { drakin } from './drakin'
import { devil } from './devil'
import { angel } from './angel'
import { tanuki } from './tanuki'
import { kitsune } from './kitsune'
import { nekomata } from './nekomata'
import { oni } from './oni'
import { tengu } from './tengu'

export { human, elf, dwarf, orc, halfling, gnome, hellborn, celestine, fae, drakin, devil, angel, tanuki, kitsune, nekomata, oni, tengu }

export const SPECIES_DEFINITIONS: Record<HeroSpecies, SpeciesDefinition> = {
  human,
  elf,
  dwarf,
  orc,
  halfling,
  gnome,
  hellborn,
  celestine,
  fae,
  drakin,
  devil,
  angel,
  tanuki,
  kitsune,
  nekomata,
  oni,
  tengu,
}

export const ALL_SPECIES = Object.values(SPECIES_DEFINITIONS)
