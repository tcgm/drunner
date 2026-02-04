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
