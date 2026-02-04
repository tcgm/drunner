import type { HeroClass } from '@/types'
import { SUMMON_SKELETON, CURSE, DRAIN_LIFE } from '@/data/abilities'

export const NECROMANCER: HeroClass = {
  id: 'necromancer',
  name: 'Necromancer',
  description: 'Summoner / Debuffer - Summons undead minions to fight alongside party',
  baseStats: {
    attack: 5,
    defense: 4,
    speed: 6,
    luck: 7,
    wisdom: 10,
    charisma: 3,
    magicPower: 13,
  },
  statGains: {
    maxHp: 4,
    attack: 2,
    defense: 2,
    speed: 5,
    luck: 6,
    wisdom: 7,
    charisma: 2,
    magicPower: 10,
  },
  abilities: [
    SUMMON_SKELETON,
    CURSE,
    DRAIN_LIFE,
  ],
  icon: 'GiDeathSkull',
}
