import type { HeroClass } from '@/types'
import { TRICKSTER_ABILITIES } from '@/data/abilities/tricksterAbilities'

/** Unique-only class. Not available in random hero generation. */
export const TRICKSTER: HeroClass = {
    id: 'trickster',
    name: 'Trickster',
    description: 'Luck Manipulator — slippery self-buffer who curses enemy fortune and bends probability',
    baseStats: {
        attack: 5,
        defense: 4,
        speed: 10,
        luck: 14,
        wisdom: 6,
        charisma: 9,
        magicPower: 4,
    },
    statGains: {
        maxHp: 5,
        attack: 3,
        defense: 3,
        speed: 8,
        luck: 11,
        wisdom: 4,
        charisma: 7,
        magicPower: 3,
    },
    primaryStats: ['luck', 'speed'],
    abilities: TRICKSTER_ABILITIES,
    icon: 'GiTripleYin',
}
