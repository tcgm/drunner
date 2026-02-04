import type { HeroClass } from '@/types'
import { BACKSTAB, DODGE, POISON_BLADE } from '@/data/abilities'

export const ROGUE: HeroClass = {
  id: 'rogue',
  name: 'Rogue',
  description: 'DPS / Critical Striker - Fast, evasive, critical hit focused',
  baseStats: {
    attack: 9,
    defense: 4,
    speed: 11,
    luck: 12,
    wisdom: 6,
    charisma: 7,
  },
  abilities: [
    BACKSTAB,
    DODGE,
    POISON_BLADE,
  ],
  icon: 'GiNinjaHeroicStance',
}
