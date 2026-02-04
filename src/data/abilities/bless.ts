import type { Ability } from '@/types'

/**
 * Cleric: Bless
 * Buff ally stats
 */
export const BLESS: Ability = {
    id: 'bless',
    name: 'Bless',
    description: 'Buff ally stats',
    cooldown: 4,
    currentCooldown: 0,
    effect: {
        type: 'buff',
        value: 5,
        target: 'ally',
        duration: 3,
    },
    icon: 'GiSparkles',
}
