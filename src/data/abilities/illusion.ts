import type { Ability } from '@/types'
import { GiTripleYin } from 'react-icons/gi'

/**
 * Trickster: Illusion
 * Vanish into misdirection, vastly increasing evasion
 */
export const ILLUSION: Ability = {
    id: 'illusion',
    name: 'Illusion',
    description: 'Step sideways into unreality — massively boosts own defense for 2 turns (scales with luck)',
    cooldown: 2,
    currentCooldown: 0,
    effect: {
        type: 'buff',
        value: 15,
        targeting: { side: 'self', breadth: 'single' },
        duration: 2,
        stat: 'defense',
        scaling: {
            stat: 'luck',
            ratio: 0.5,
        },
    },
    icon: GiTripleYin,
}
