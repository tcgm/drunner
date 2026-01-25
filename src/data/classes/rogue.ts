import type { HeroClass } from '@/types'

export const ROGUE: HeroClass = {
  id: 'rogue',
  name: 'Rogue',
  description: 'DPS / Critical Striker - Fast, evasive, critical hit focused',
  baseStats: {
    attack: 9,
    defense: 4,
    speed: 11,
    luck: 12,
  },
  abilities: [
    {
      id: 'backstab',
      name: 'Backstab',
      description: 'High critical chance attack',
      cooldown: 2,
      currentCooldown: 0,
      effect: {
        type: 'damage',
        value: 22,
        target: 'enemy',
      },
    },
    {
      id: 'dodge',
      name: 'Dodge',
      description: 'Avoid next attack',
      cooldown: 3,
      currentCooldown: 0,
      effect: {
        type: 'buff',
        value: 100,
        target: 'self',
        duration: 1,
      },
    },
    {
      id: 'poison-blade',
      name: 'Poison Blade',
      description: 'Damage over time attack',
      cooldown: 3,
      currentCooldown: 0,
      effect: {
        type: 'damage',
        value: 12,
        target: 'enemy',
        duration: 3,
      },
    },
  ],
  icon: 'GiNinjaHeroicStance',
}
