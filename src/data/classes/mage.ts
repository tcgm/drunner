import type { HeroClass } from '@/types'
import { FIREBALL, MAGIC_MISSILE, MANA_SHIELD } from '@/data/abilities'

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
  abilities: [
    FIREBALL,
    MAGIC_MISSILE,
    MANA_SHIELD,
  ],
  icon: 'GiWizardStaff',
}
