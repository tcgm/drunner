import type { HeroClass } from '@/types'
import { REAPER_ABILITIES } from '@/data/abilities/reaperAbilities'

/** Unique-only class. Not available in random hero generation. */
export const REAPER: HeroClass = {
    id: 'reaper',
    name: 'Reaper',
    description: 'Death Bringer — precise lethal striker who marks targets and harvests souls',
    baseStats: {
        attack: 11,
        defense: 3,
        speed: 8,
        luck: 5,
        wisdom: 7,
        charisma: 2,
        magicPower: 9,
    },
    statGains: {
        maxHp: 6,
        attack: 8,
        defense: 2,
        speed: 6,
        luck: 4,
        wisdom: 5,
        charisma: 1,
        magicPower: 7,
    },
    primaryStats: ['attack', 'magicPower'],
    abilities: REAPER_ABILITIES,
    icon: 'GiGrimReaper',
}
