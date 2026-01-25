import type { HeroClass } from '@/types'

export const RANGER: HeroClass = {
  id: 'ranger',
  name: 'Ranger',
  description: 'Balanced DPS / Ranged - Consistent damage from range with utility',
  baseStats: {
    attack: 8,
    defense: 5,
    speed: 9,
    luck: 9,
  },
  abilities: [
    {
      id: 'aimed-shot',
      name: 'Aimed Shot',
      description: 'High accuracy attack',
      cooldown: 2,
      currentCooldown: 0,
      effect: {
        type: 'damage',
        value: 18,
        target: 'enemy',
      },
    },
    {
      id: 'quick-shot',
      name: 'Quick Shot',
      description: 'Fast, lower damage attack',
      cooldown: 1,
      currentCooldown: 0,
      effect: {
        type: 'damage',
        value: 12,
        target: 'enemy',
      },
    },
    {
      id: 'track',
      name: 'Track',
      description: 'Reveal event information',
      cooldown: 5,
      currentCooldown: 0,
      effect: {
        type: 'special',
        value: 0,
        target: 'self',
      },
    },
  ],
  icon: 'GiBowArrow',
}
