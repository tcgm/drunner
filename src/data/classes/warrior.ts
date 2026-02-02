import type { HeroClass } from '@/types'

export const WARRIOR: HeroClass = {
  id: 'warrior',
  name: 'Warrior',
  description: 'Tank / Frontline Fighter - Absorbs damage, deals consistent physical damage',
  baseStats: {
    attack: 10,
    defense: 8,
    speed: 5,
    luck: 4,
    wisdom: 4,
    charisma: 5,
  },
  abilities: [
    {
      id: 'power-strike',
      name: 'Power Strike',
      description: 'High damage single attack',
      cooldown: 2,
      currentCooldown: 0,
      effect: {
        type: 'damage',
        value: 20,
        target: 'enemy',
      },
    },
    {
      id: 'defend',
      name: 'Defend',
      description: 'Reduce incoming damage this turn',
      cooldown: 3,
      currentCooldown: 0,
      effect: {
        type: 'buff',
        value: 10,
        target: 'self',
        duration: 1,
      },
    },
    {
      id: 'taunt',
      name: 'Taunt',
      description: 'Draw enemy attention',
      cooldown: 4,
      currentCooldown: 0,
      effect: {
        type: 'debuff',
        value: 0,
        target: 'enemy',
        duration: 2,
      },
    },
  ],
  icon: 'GiSwordman',
}
