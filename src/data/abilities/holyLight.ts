import type { Ability } from '@/types'

/**
 * Cleric: Holy Light
 * Damage enemy with minor self heal
 */
export const HOLY_LIGHT: Ability = {
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
    icon: 'GiSunbeams',
}
