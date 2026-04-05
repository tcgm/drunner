import type { Ability } from '@/types'
import { GiSunbeams } from 'react-icons/gi'

/**
 * Archangel: Fortress of Light
 * Shield the entire party with divine light
 */
export const FORTRESS_OF_LIGHT: Ability = {
    id: 'fortress-of-light',
    name: 'Fortress of Light',
    description: 'Wrap the entire party in holy light, boosting their defense for 2 turns (scales with wisdom)',
    cooldown: 4,
    currentCooldown: 0,
    effect: {
        type: 'buff',
        value: 10,
        targeting: { side: 'party', breadth: 'all' },
        duration: 2,
        stat: 'defense',
        scaling: {
            stat: 'wisdom',
            ratio: 0.4,
        },
    },
    icon: GiSunbeams,
}
