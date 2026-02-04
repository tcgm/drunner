import type { Ability } from '@/types'

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
