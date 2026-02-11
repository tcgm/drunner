import type { Ability } from '@/types'
import { GiSparkles } from 'react-icons/gi'

/**
 * Cleric: Bless
 * Buff ally stats
 */
export const BLESS: Ability = {
    id: 'bless',
    name: 'Bless',
    description: 'Buff ally stats (scales with wisdom)',
    cooldown: 4,
    currentCooldown: 0,
    effect: {
        type: 'buff',
        value: 5,
        target: 'ally',
        duration: 2,
        scaling: {
            stat: 'wisdom',
            ratio: 0.3
        }
    },
    icon: GiSparkles,
}
