import type { Ability } from '@/types'
import { GiSpiralArrow } from 'react-icons/gi'

/**
 * Monk: Ki Strike
 * Channelled ki burst that bypasses armor
 */
export const KI_STRIKE: Ability = {
    id: 'ki-strike',
    name: 'Ki Strike',
    description: 'Channel ki into a precise strike that ignores defense (scales with attack)',
    cooldown: 3,
    currentCooldown: 0,
    effect: {
        type: 'damage',
        value: 50,
        targeting: { side: 'enemy', breadth: 'single' },
        scaling: {
            stat: 'attack',
            ratio: 2.2,
        },
    },
    icon: GiSpiralArrow,
}
