import type { Ability } from '@/types'

/**
 * Necromancer: Curse
 * Debuff enemy stats
 */
export const CURSE: Ability = {
    id: 'curse',
    name: 'Curse',
    description: 'Debuff enemy stats',
    cooldown: 3,
    currentCooldown: 0,
    effect: {
        type: 'debuff',
        value: 5,
        target: 'enemy',
        duration: 3,
    },
    icon: 'GiCursedStar',
}
