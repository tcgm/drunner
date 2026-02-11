import type { HeroClass } from '@/types'
import { MAGE_ABILITIES } from '@/data/abilities/mage'

export const MAGE: HeroClass = {
  id: 'mage',
  name: 'Mage',
  description: 'Glass Cannon / Burst Damage - Devastating magical abilities but fragile',
  baseStats: {
    attack: 6,
    defense: 3,
    speed: 6,
    luck: 7,
    wisdom: 11,
    charisma: 5,
    magicPower: 15,
  },
  statGains: {
    maxHp: 3,
    attack: 2,
    defense: 2,
    speed: 5,
    luck: 6,
    wisdom: 8,
    charisma: 4,
    magicPower: 10,
  },
  abilities: MAGE_ABILITIES,
  icon: 'GiWizardStaff',
}
