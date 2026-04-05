import type { HeroClass } from '@/types'
import { ARCHANGEL_ABILITIES } from '@/data/abilities/archangelAbilities'

/** Unique-only class. Not available in random hero generation. */
export const ARCHANGEL: HeroClass = {
    id: 'archangel',
    name: 'Archangel',
    description: 'Holy Warrior-Mage — devastating divine strikes and powerful party-wide support',
    baseStats: {
        attack: 7,
        defense: 8,
        speed: 6,
        luck: 5,
        wisdom: 12,
        charisma: 6,
        magicPower: 12,
    },
    statGains: {
        maxHp: 7,
        attack: 5,
        defense: 6,
        speed: 5,
        luck: 4,
        wisdom: 9,
        charisma: 4,
        magicPower: 9,
    },
    primaryStats: ['magicPower', 'wisdom'],
    abilities: ARCHANGEL_ABILITIES,
    icon: 'GiHolySymbol',
}
