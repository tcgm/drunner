import type { HeroClass } from '@/types'

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
    {
      id: 'fireball',
      name: 'Fireball',
      description: 'Magic damage to enemy',
      cooldown: 2,
      currentCooldown: 0,
      effect: {
        type: 'damage',
        value: 25,
        target: 'enemy',
      },
    },
    {
      id: 'magic-missile',
      name: 'Magic Missile',
      description: 'Guaranteed hit magical attack',
      cooldown: 1,
      currentCooldown: 0,
      effect: {
        type: 'damage',
        value: 15,
        target: 'enemy',
      },
    },
    {
      id: 'mana-shield',
      name: 'Mana Shield',
      description: 'Temporary magical protection',
      cooldown: 4,
      currentCooldown: 0,
      effect: {
        type: 'buff',
        value: 15,
        target: 'self',
        duration: 2,
      },
    },
  ],
  icon: 'GiWizardStaff',
}
