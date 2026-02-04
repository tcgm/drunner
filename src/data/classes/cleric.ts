import type { HeroClass } from '@/types'
import { HEAL, BLESS, HOLY_LIGHT } from '@/data/abilities'

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
  abilities: [
    HEAL,
    BLESS,
    HOLY_LIGHT,
  ],
  icon: 'GiHolySymbol',
}
