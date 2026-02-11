import type { HeroClass } from '@/types'
import { ROGUE_ABILITIES } from '@/data/abilities/rogue'

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
  statGains: {
    maxHp: 5,
    attack: 6,
    defense: 2,
    speed: 9,
    luck: 9,
    wisdom: 3,
    charisma: 4,
  },
  abilities: ROGUE_ABILITIES,
  icon: 'GiNinjaHeroicStance',
}
