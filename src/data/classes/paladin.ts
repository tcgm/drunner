import type { HeroClass } from '@/types'

export const PALADIN: HeroClass = {
  id: 'paladin',
  name: 'Paladin',
  description: 'Holy Tank / Hybrid - Durable warrior with healing support',
  baseStats: {
    attack: 8,
    defense: 9,
    speed: 4,
    luck: 6,
    magicPower: 8,
  },
  abilities: [
    {
      id: 'smite',
      name: 'Smite',
      description: 'Holy damage attack',
      cooldown: 2,
      currentCooldown: 0,
      effect: {
        type: 'damage',
        value: 20,
        target: 'enemy',
      },
    },
    {
      id: 'lay-on-hands',
      name: 'Lay on Hands',
      description: 'Heal self or ally',
      cooldown: 4,
      currentCooldown: 0,
      effect: {
        type: 'heal',
        value: 20,
        target: 'ally',
      },
    },
    {
      id: 'divine-shield',
      name: 'Divine Shield',
      description: 'Temporary invulnerability',
      cooldown: 6,
      currentCooldown: 0,
      effect: {
        type: 'buff',
        value: 999,
        target: 'self',
        duration: 1,
      },
    },
  ],
  icon: 'GiTemplarShield',
}
