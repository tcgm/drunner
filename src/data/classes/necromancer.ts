import type { HeroClass } from '@/types'

export const NECROMANCER: HeroClass = {
  id: 'necromancer',
  name: 'Necromancer',
  description: 'Summoner / Debuffer - Summons undead minions to fight alongside party',
  baseStats: {
    attack: 5,
    defense: 4,
    speed: 6,
    luck: 7,
    wisdom: 10,
    charisma: 3,
    magicPower: 13,
  },
  abilities: [
    {
      id: 'summon-skeleton',
      name: 'Summon Skeleton',
      description: 'Create undead minion ally',
      cooldown: 5,
      currentCooldown: 0,
      effect: {
        type: 'special',
        value: 15,
        target: 'self',
        duration: 5,
      },
    },
    {
      id: 'curse',
      name: 'Curse',
      description: 'Debuff enemy stats',
      cooldown: 3,
      currentCooldown: 0,
      effect: {
        type: 'debuff',
        value: 5,
        target: 'enemy',
        duration: 3,
      },
    },
    {
      id: 'drain-life',
      name: 'Drain Life',
      description: 'Damage enemy and heal self',
      cooldown: 2,
      currentCooldown: 0,
      effect: {
        type: 'damage',
        value: 15,
        target: 'enemy',
      },
    },
  ],
  icon: 'GiDeathSkull',
}
