import type { Ability } from '@/types'
import { GiLightningStorm } from 'react-icons/gi'

/**
 * Shaman: Spirit Strike
 * Channel ancestral spirits into a devastating elemental blow.
 */
export const SPIRIT_STRIKE: Ability = {
    id: 'spirit-strike',
    name: 'Spirit Strike',
    description: 'Channel ancestral power into a spirit-infused elemental strike (scales with magic power).',
    cooldown: 2,
    currentCooldown: 0,
    effect: {
        type: 'damage',
        value: 22,
        targeting: { side: 'enemy', breadth: 'single' },
        scaling: {
            stat: 'magicPower',
            ratio: 1.5,
        },
    },
    icon: GiLightningStorm,
}
