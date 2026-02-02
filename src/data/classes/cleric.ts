import type { HeroClass } from '@/types'

export const CLERIC: HeroClass = {
  id: 'cleric',
  name: 'Cleric',
  description: 'Healer / Support - Keeps party alive, provides buffs',
  baseStats: {
    attack: 5,
    defense: 6,
    speed: 5,
    luck: 8,
    wisdom: 12,
    charisma: 9,
    magicPower: 12,
  },
  abilities: [
    {
      id: 'heal',
      name: 'Heal',
      description: 'Restore HP to ally',
      cooldown: 2,
      currentCooldown: 0,
      effect: {
        type: 'heal',
        value: 25,
        target: 'ally',
      },
    },
    {
      id: 'bless',
      name: 'Bless',
      description: 'Buff ally stats',
      cooldown: 4,
      currentCooldown: 0,
      effect: {
        type: 'buff',
        value: 5,
        target: 'ally',
        duration: 3,
      },
    },
    {
      id: 'holy-light',
      name: 'Holy Light',
      description: 'Damage enemy with minor self heal',
      cooldown: 3,
      currentCooldown: 0,
      effect: {
        type: 'damage',
        value: 15,
        target: 'enemy',
      },
    },
  ],
  icon: 'GiHolySymbol',
}
