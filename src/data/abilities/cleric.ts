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
}

/**
 * Cleric: Smite
 * Holy damage to enemy
 */
export const SMITE: Ability = {
    id: 'smite',
    name: 'Smite',
    description: 'Holy damage to enemy',
    cooldown: 3,
    currentCooldown: 0,
    effect: {
        type: 'damage',
        value: 20,
        target: 'enemy',
    },
}

/**
 * Cleric: Divine Protection
 * Grant defensive buff
 */
export const DIVINE_PROTECTION: Ability = {
    id: 'divine-protection',
    name: 'Divine Protection',
    description: 'Grant defensive buff',
    cooldown: 4,
    currentCooldown: 0,
    effect: {
        type: 'buff',
        value: 15,
        target: 'all-allies',
        duration: 2,
    },
}
