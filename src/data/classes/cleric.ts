import type { HeroClass } from '@/types'
import { CLERIC_ABILITIES } from '@/data/abilities/clericAbilities'

export const CLERIC: HeroClass = {
  id: 'cleric',
  name: 'Cleric',
  description: 'Healer / Support - Keeps party alive, provides buffs',
  baseStats: {
    attack: 5,
    defense: 6,
    speed: 5,
    luck: 8,
    wisdom: 12,
    charisma: 9,
    magicPower: 12,
  },
  statGains: {
    maxHp: 6,
    attack: 2,
    defense: 4,
    speed: 4,
    luck: 5,
    wisdom: 8,
    charisma: 6,
    magicPower: 7,
  },
  abilities: CLERIC_ABILITIES,
  icon: 'GiHolySymbol',
}
