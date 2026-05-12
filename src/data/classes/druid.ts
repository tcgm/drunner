import type { HeroClass } from '@/types'
import { DRUID_ABILITIES } from '@/data/abilities/druidAbilities'

export const DRUID: HeroClass = {
  id: 'druid',
  name: 'Druid',
  description: 'Nature Healer / Crowd Controller - Heals allies, poisons enemies, and tangles foes in roots',
  baseStats: {
    attack: 5,
    defense: 5,
    speed: 6,
    luck: 7,
    wisdom: 12,
    charisma: 7,
    magicPower: 11,
  },
  statGains: {
    maxHp: 5,
    attack: 2,
    defense: 3,
    speed: 5,
    luck: 5,
    wisdom: 9,
    charisma: 5,
    magicPower: 8,
  },
  primaryStats: ['wisdom', 'magicPower'],
  abilities: DRUID_ABILITIES,
  icon: 'GiOakLeaf',
}
