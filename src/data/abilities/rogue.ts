import type { Ability } from '@/types'

/**
 * Rogue: Backstab
 * High single-target damage
 */
export const BACKSTAB: Ability = {
    id: 'backstab',
    name: 'Backstab',
    description: 'High single-target damage',
    cooldown: 2,
    currentCooldown: 0,
    effect: {
        type: 'damage',
        value: 30,
        target: 'enemy',
    },
}

/**
 * Rogue: Poison Blade
 * Damage over time
 */
export const POISON_BLADE: Ability = {
    id: 'poison-blade',
    name: 'Poison Blade',
    description: 'Damage over time',
    cooldown: 3,
    currentCooldown: 0,
    effect: {
        type: 'debuff',
        value: 5,
        target: 'enemy',
        duration: 3,
    },
}

/**
 * Rogue: Evasion
 * Increase dodge chance
 */
export const EVASION: Ability = {
    id: 'evasion',
    name: 'Evasion',
    description: 'Increase dodge chance',
    cooldown: 4,
    currentCooldown: 0,
    effect: {
        type: 'buff',
        value: 20,
        target: 'self',
        duration: 2,
    },
}
