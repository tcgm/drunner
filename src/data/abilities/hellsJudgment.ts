import type { Ability } from '@/types'
import { GiDevilMask } from 'react-icons/gi'

/**
 * Archdevil: Hell's Judgment
 * Condemn all enemies, shredding their defenses
 */
export const HELLS_JUDGMENT: Ability = {
    id: 'hells-judgment',
    name: "Hell's Judgment",
    description: 'Pass infernal sentence on all enemies — strips their defense for 3 turns (scales with magic power)',
    cooldown: 5,
    currentCooldown: 0,
    effect: {
        type: 'debuff',
        value: 6,
        targeting: { side: 'enemy', breadth: 'all' },
        duration: 3,
        stat: 'defense',
        scaling: {
            stat: 'magicPower',
            ratio: 0.3,
        },
    },
    icon: GiDevilMask,
}
