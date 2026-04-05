import type { Ability } from '@/types'
import { GiEyeTarget } from 'react-icons/gi'

/**
 * Oracle: Foresight
 * Share a glimpse of what's to come, boosting the party's luck
 */
export const FORESIGHT: Ability = {
    id: 'foresight',
    name: 'Foresight',
    description: 'Grant the party a glimpse of fate, boosting their luck for 4 turns (scales with luck)',
    cooldown: 3,
    currentCooldown: 0,
    effect: {
        type: 'buff',
        value: 6,
        targeting: { side: 'party', breadth: 'all' },
        duration: 4,
        stat: 'luck',
        scaling: {
            stat: 'luck',
            ratio: 0.3,
        },
    },
    icon: GiEyeTarget,
}
