import type { Ability } from '@/types'
import { GiPunch } from 'react-icons/gi'

/**
 * Monk: Iron Fist
 * Fast unarmed strike
 */
export const IRON_FIST: Ability = {
    id: 'iron-fist',
    name: 'Iron Fist',
    description: 'Rapid unarmed strike (scales with attack)',
    cooldown: 1,
    currentCooldown: 0,
    effect: {
        type: 'damage',
        value: 30,
        targeting: { side: 'enemy', breadth: 'single' },
        scaling: {
            stat: 'attack',
            ratio: 1.8,
        },
    },
    icon: GiPunch,
}
