import type { HeroClass } from '@/types'
import { ARCHDEVIL_ABILITIES } from '@/data/abilities/archdevilAbilities'

/** Unique-only class. Not available in random hero generation. */
export const ARCHDEVIL: HeroClass = {
    id: 'archdevil',
    name: 'Archdevil',
    description: 'Infernal Sovereign — overwhelming offense, party attack aura, and crushing judgment',
    baseStats: {
        attack: 13,
        defense: 4,
        speed: 7,
        luck: 6,
        wisdom: 5,
        charisma: 11,
        magicPower: 10,
    },
    statGains: {
        maxHp: 6,
        attack: 10,
        defense: 3,
        speed: 6,
        luck: 4,
        wisdom: 4,
        charisma: 8,
        magicPower: 7,
    },
    primaryStats: ['attack', 'charisma'],
    abilities: ARCHDEVIL_ABILITIES,
    icon: 'GiCrownedSkull',
}
