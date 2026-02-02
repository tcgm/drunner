import type { HeroClass } from '@/types'

export const BARD: HeroClass = {
  id: 'bard',
  name: 'Bard',
  description: 'Buffer / Utility Support - Enhances allies, weakens enemies, versatile',
  baseStats: {
    attack: 6,
    defense: 5,
    speed: 8,
    luck: 10,
    wisdom: 8,
    charisma: 12,
    magicPower: 9,
  },
  abilities: [
    {
      id: 'inspire',
      name: 'Inspire',
      description: 'Buff all allies',
      cooldown: 4,
      currentCooldown: 0,
      effect: {
        type: 'buff',
        value: 3,
        target: 'all-allies',
        duration: 3,
      },
    },
    {
      id: 'song-of-rest',
      name: 'Song of Rest',
      description: 'Heal over time to all allies',
      cooldown: 5,
      currentCooldown: 0,
      effect: {
        type: 'heal',
        value: 10,
        target: 'all-allies',
        duration: 3,
      },
    },
    {
      id: 'discordant-note',
      name: 'Discordant Note',
      description: 'Debuff enemy stats',
      cooldown: 3,
      currentCooldown: 0,
      effect: {
        type: 'debuff',
        value: 4,
        target: 'enemy',
        duration: 2,
      },
    },
  ],
  icon: 'GiMusicalNotes',
}
