import type { HeroClass } from '@/types'
import { SHAMAN_ABILITIES } from '@/data/abilities/shamanAbilities'

export const SHAMAN: HeroClass = {
  id: 'shaman',
  name: 'Shaman',
  description: 'Elemental Caster / Party Buffer - Calls on spirits and elements to strike foes and shield allies',
  baseStats: {
    attack: 7,
    defense: 4,
    speed: 5,
    luck: 6,
    wisdom: 10,
    charisma: 6,
    magicPower: 13,
  },
  statGains: {
    maxHp: 4,
    attack: 4,
    defense: 3,
    speed: 4,
    luck: 5,
    wisdom: 7,
    charisma: 4,
    magicPower: 9,
  },
  primaryStats: ['magicPower', 'wisdom'],
  abilities: SHAMAN_ABILITIES,
  icon: 'GiSpiritualOrb',
}
