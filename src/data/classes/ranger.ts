import type { HeroClass } from '@/types'
import { RANGER_ABILITIES } from '@/data/abilities/ranger'

export const RANGER: HeroClass = {
  id: 'ranger',
  name: 'Ranger',
  description: 'Balanced DPS / Ranged - Consistent damage from range with utility',
  baseStats: {
    attack: 8,
    defense: 5,
    speed: 9,
    luck: 9,
    wisdom: 8,
    charisma: 6,
  },
  statGains: {
    maxHp: 6,
    attack: 6,
    defense: 4,
    speed: 7,
    luck: 6,
    wisdom: 5,
    charisma: 4,
    magicPower: 2,
  },
  abilities: RANGER_ABILITIES,
  icon: 'GiBowArrow',
}
