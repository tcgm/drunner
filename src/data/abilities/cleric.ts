import type { Ability } from '@/types'

/**
 * Cleric: Heal
 * Restore ally HP
 */
export const HEAL: Ability = {
    id: 'heal',
    name: 'Heal',
    description: 'Restore ally HP',
    cooldown: 2,
    currentCooldown: 0,
    effect: {
        type: 'heal',
        value: 30,
        target: 'ally',
    },
    icon: 'GiHealing',
}

/**
 * Cleric: Bless
 * Buff ally stats
 */
export const BLESS: Ability = {
    id: 'bless',
    name: 'Bless',
    description: 'Buff ally stats',
    cooldown: 4,
    currentCooldown: 0,
    effect: {
        type: 'buff',
        value: 5,
        target: 'ally',
        duration: 3,
    },
    icon: 'GiSparkles',
}

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
