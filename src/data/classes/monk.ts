import type { HeroClass } from '@/types'
import { MONK_ABILITIES } from '@/data/abilities/monkAbilities'

export const MONK: HeroClass = {
    id: 'monk',
    name: 'Monk',
    description: 'Martial Ascetic - fast unarmed combatant who relies on discipline, not luck',
    baseStats: {
        attack: 8,
        defense: 5,
        speed: 10,
        luck: 0,
        wisdom: 7,
        charisma: 4,
    },
    statGains: {
        maxHp: 7,
        attack: 7,
        defense: 4,
        speed: 8,
        luck: 0,
        wisdom: 6,
        charisma: 2,
        magicPower: 2,
    },
    primaryStats: ['speed', 'attack'],
    abilities: MONK_ABILITIES,
    icon: 'GiPunch',
}
