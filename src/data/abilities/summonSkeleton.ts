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
    icon: 'GiSkeletonKey',
}
