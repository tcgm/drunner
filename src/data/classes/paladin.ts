import type { HeroClass } from '@/types'
import { PALADIN_ABILITIES } from '@/data/abilities/paladinAbilities'

export const PALADIN: HeroClass = {
  id: 'paladin',
  name: 'Paladin',
  description: 'Holy Tank / Hybrid - Durable warrior with healing support',
  baseStats: {
    attack: 8,
    defense: 9,
    speed: 4,
    luck: 6,
    wisdom: 9,
    charisma: 10,
    magicPower: 8,
  },
  statGains: {
    maxHp: 8,
    attack: 5,
    defense: 7,
    speed: 3,
    luck: 4,
    wisdom: 5,
    charisma: 6,
    magicPower: 5,
  },
  abilities: PALADIN_ABILITIES,
  icon: 'GiTemplarShield',
}
