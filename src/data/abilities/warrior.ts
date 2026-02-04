import type { Ability } from '@/types'

/**
 * Warrior: Power Strike
 * High damage single attack
 */
export const POWER_STRIKE: Ability = {
    id: 'power-strike',
    name: 'Power Strike',
    description: 'High damage single attack',
    cooldown: 2,
    currentCooldown: 0,
    effect: {
        type: 'damage',
        value: 20,
        target: 'enemy',
    },
    icon: 'GiPunch',
}

/**
 * Warrior: Defend
 * Reduce incoming damage this turn
 */
export const DEFEND: Ability = {
    id: 'defend',
    name: 'Defend',
    description: 'Reduce incoming damage this turn',
    cooldown: 3,
    currentCooldown: 0,
    effect: {
        type: 'buff',
        value: 10,
        target: 'self',
        duration: 1,
    },
    icon: 'GiShield',
}

/**
 * Warrior: Taunt
 * Draw enemy attention
 */
export const TAUNT: Ability = {
    id: 'taunt',
    name: 'Taunt',
    description: 'Draw enemy attention',
    cooldown: 4,
    currentCooldown: 0,
    effect: {
        type: 'debuff',
        value: 0,
        target: 'enemy',
        duration: 2,
    },
    icon: 'GiRoar',
}
