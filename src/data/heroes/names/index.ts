import type { HeroSpecies } from '@/types'

import * as common from './common'
import * as elven from './elven'
import * as dwarven from './dwarven'
import * as orcish from './orcish'
import * as halfling from './halfling'
import * as gnomish from './gnomish'
import * as infernal from './infernal'
import * as celestial from './celestial'

import * as sylvan from './sylvan'
import * as draconic from './draconic'
import * as yokai from './yokai'

export { common, elven, dwarven, orcish, halfling, gnomish, infernal, celestial, sylvan, draconic, yokai }

type NameStyle = 'common' | 'elven' | 'dwarven' | 'orcish' | 'halfling' | 'gnomish' | 'infernal' | 'celestial' | 'sylvan' | 'draconic' | 'yokai'
type NamePool = { first: string[]; last: string[] }

const NAMES_BY_STYLE: Record<NameStyle, NamePool> = {
  common,
  elven,
  dwarven,
  orcish,
  halfling,
  gnomish,
  infernal,
  celestial,
  sylvan,
  draconic,
  yokai,
}

const STYLE_BY_SPECIES: Record<HeroSpecies, NameStyle> = {
  human: 'common',
  elf: 'elven',
  dwarf: 'dwarven',
  orc: 'orcish',
  halfling: 'halfling',
  gnome: 'gnomish',
  hellborn: 'infernal',
  celestine: 'celestial',
  fae: 'sylvan',
  drakin: 'draconic',
  devil: 'infernal',
  angel: 'celestial',
  tanuki: 'yokai',
  kitsune: 'yokai',
  nekomata: 'yokai',
  oni: 'yokai',
  tengu: 'yokai',
  dryad: 'sylvan',
}

function pick<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)]
}

export function generateHeroName(species: HeroSpecies, rng: () => number = Math.random): string {
  const style = STYLE_BY_SPECIES[species]
  const pool = NAMES_BY_STYLE[style]
  return `${pick(pool.first, rng)} ${pick(pool.last, rng)}`
}
