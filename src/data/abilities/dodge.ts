import type { Ability } from '@/types'

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
