import type { Ability } from '@/types'

/**
 * Paladin: Smite
 * Holy damage attack
 */
export const SMITE_PALADIN: Ability = {
    id: 'smite',
    name: 'Smite',
    description: 'Holy damage attack',
    cooldown: 2,
    currentCooldown: 0,
    effect: {
        type: 'damage',
        value: 20,
        target: 'enemy',
    },
}

/**
 * Paladin: Lay on Hands
 * Heal self or ally
 */
export const LAY_ON_HANDS: Ability = {
    id: 'lay-on-hands',
    name: 'Lay on Hands',
    description: 'Heal self or ally',
    cooldown: 4,
    currentCooldown: 0,
    effect: {
        type: 'heal',
        value: 20,
        target: 'ally',
    },
}

/**
 * Paladin: Divine Shield
 * Temporary invulnerability
 */
export const DIVINE_SHIELD: Ability = {
    id: 'divine-shield',
    name: 'Divine Shield',
    description: 'Temporary invulnerability',
    cooldown: 6,
    currentCooldown: 0,
    effect: {
        type: 'buff',
        value: 999,
        target: 'self',
        duration: 1,
    },
}
