import type { Ability } from '@/types'

/**
 * Necromancer: Summon Skeleton
 * Create undead minion ally
 */
export const SUMMON_SKELETON: Ability = {
    id: 'summon-skeleton',
    name: 'Summon Skeleton',
    description: 'Create undead minion ally',
    cooldown: 5,
    currentCooldown: 0,
    effect: {
        type: 'special',
        value: 15,
        target: 'self',
        duration: 5,
    },
}

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
}

/**
 * Necromancer: Drain Life
 * Damage enemy and heal self
 */
export const DRAIN_LIFE: Ability = {
    id: 'drain-life',
    name: 'Drain Life',
    description: 'Damage enemy and heal self',
    cooldown: 2,
    currentCooldown: 0,
    effect: {
        type: 'damage',
        value: 15,
        target: 'enemy',
    },
}
