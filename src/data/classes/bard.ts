import type { HeroClass } from '@/types'
import { INSPIRE, SONG_OF_REST, DISCORDANT_NOTE } from '@/data/abilities'

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
  statGains: {
    maxHp: 5,
    attack: 3,
    defense: 3,
    speed: 6,
    luck: 7,
    wisdom: 5,
    charisma: 8,
    magicPower: 6,
  },
  abilities: [
    INSPIRE,
    SONG_OF_REST,
    DISCORDANT_NOTE,
  ],
  icon: 'GiMusicalNotes',
}
