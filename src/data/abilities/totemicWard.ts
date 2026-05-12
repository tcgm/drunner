import type { Ability } from '@/types'
import { GiTotem } from 'react-icons/gi'

/**
 * Shaman: Totemic Ward
 * Plant a spirit totem that buffs defense for all party members.
 */
export const TOTEMIC_WARD: Ability = {
    id: 'totemic-ward',
    name: 'Totemic Ward',
    description: 'Plant a spirit totem, buffing defense for all party members for 3 turns (scales with wisdom).',
    cooldown: 5,
    currentCooldown: 0,
    effect: {
        type: 'buff',
        value: 6,
        targeting: { side: 'party', breadth: 'all' },
        duration: 3,
        stat: 'defense',
        scaling: {
            stat: 'wisdom',
            ratio: 0.35,
        },
    },
    icon: GiTotem,
}
