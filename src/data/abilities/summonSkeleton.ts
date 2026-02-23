import type { Ability } from '@/types'
import { GiSkeletonKey } from 'react-icons/gi'

/**
 * Necromancer: Summon Skeleton
 * Create undead minion ally
 */
export const SUMMON_SKELETON: Ability = {
    id: 'summon-skeleton',
    name: 'Summon Skeleton',
    description: 'Create undead minion that boosts your attack — scales with Magic Power',
    cooldown: 5,
    currentCooldown: 0,
    effect: {
        type: 'special',
        value: 15,
        targeting: { side: 'self', breadth: 'single' },
        duration: 5,
        scaling: { stat: 'magicPower', ratio: 0.5 },
    },
    icon: GiSkeletonKey,
}
