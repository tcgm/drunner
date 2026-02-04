import type { Ability } from '@/types'

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
