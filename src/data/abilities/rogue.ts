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
    icon: 'GiSwordSmithing',
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
    icon: 'GiPoisonBottle',
}

/**
 * Rogue: Dodge
 * Avoid next attack
 */
export const DODGE: Ability = {
    id: 'dodge',
    name: 'Dodge',
    description: 'Avoid next attack',
    cooldown: 3,
    currentCooldown: 0,
    effect: {
        type: 'buff',
        value: 100,
        target: 'self',
        duration: 1,
    },
    icon: 'GiDodge',
}
