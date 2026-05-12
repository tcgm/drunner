import type { Ability } from '@/types'
import { GiLeafSwirl } from 'react-icons/gi'

/**
 * Druid: Nature Mend
 * Channel natural energy to restore HP to the most wounded ally.
 */
export const NATURE_MEND: Ability = {
    id: 'nature-mend',
    name: 'Nature Mend',
    description: 'Channel natural energy to restore HP to the most wounded ally (scales with wisdom).',
    cooldown: 2,
    cooldownType: 'depth',
    currentCooldown: 0,
    effect: {
        type: 'heal',
        value: 22,
        targeting: { side: 'ally', breadth: 'single', priority: 'lowest', priorityStat: 'hpPercent', includesSelf: true },
        scaling: {
            stat: 'wisdom',
            ratio: 0.6,
        },
    },
    icon: GiLeafSwirl,
}
