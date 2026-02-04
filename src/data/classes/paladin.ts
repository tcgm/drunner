import type { HeroClass } from '@/types'
import { SMITE_PALADIN, LAY_ON_HANDS, DIVINE_SHIELD } from '@/data/abilities'

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
  abilities: [
    SMITE_PALADIN,
    LAY_ON_HANDS,
    DIVINE_SHIELD,
  ],
  icon: 'GiTemplarShield',
}
