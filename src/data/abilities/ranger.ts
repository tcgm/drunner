import type { Ability } from '@/types'

/**
 * Ranger: Aimed Shot
 * High accuracy attack
 */
export const AIMED_SHOT: Ability = {
    id: 'aimed-shot',
    name: 'Aimed Shot',
    description: 'High accuracy attack',
    cooldown: 2,
    currentCooldown: 0,
    effect: {
        type: 'damage',
        value: 18,
        target: 'enemy',
    },
}

/**
 * Ranger: Quick Shot
 * Fast, lower damage attack
 */
export const QUICK_SHOT: Ability = {
    id: 'quick-shot',
    name: 'Quick Shot',
    description: 'Fast, lower damage attack',
    cooldown: 1,
    currentCooldown: 0,
    effect: {
        type: 'damage',
        value: 12,
        target: 'enemy',
    },
}

/**
 * Ranger: Track
 * Reveal event information
 */
export const TRACK: Ability = {
    id: 'track',
    name: 'Track',
    description: 'Reveal event information',
    cooldown: 5,
    currentCooldown: 0,
    effect: {
        type: 'special',
        value: 0,
        target: 'self',
    },
}
