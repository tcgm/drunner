import type { HeroClass } from '@/types'
import { WARRIOR_ABILITIES } from '@/data/abilities/warriorAbilities'

export const WARRIOR: HeroClass = {
  id: 'warrior',
  name: 'Warrior',
  description: 'Tank / Frontline Fighter - Absorbs damage, deals consistent physical damage',
  baseStats: {
    attack: 10,
    defense: 8,
    speed: 5,
    luck: 4,
    wisdom: 4,
    charisma: 5,
  },
  statGains: {
    maxHp: 10,
    attack: 7,
    defense: 8,
    speed: 4,
    luck: 3,
    wisdom: 2,
    charisma: 4,
    magicPower: 2,
  },
  abilities: WARRIOR_ABILITIES,
  icon: 'GiSwordman',
}
