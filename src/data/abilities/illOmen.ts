import type { Ability } from '@/types'
import { GiCrystalBall } from 'react-icons/gi'

/**
 * Oracle: Ill Omen
 * Read an enemy's weakness in the threads of fate, slowing their reaction
 */
export const ILL_OMEN: Ability = {
    id: 'ill-omen',
    name: 'Ill Omen',
    description: 'Curse an enemy with an ill fate, reducing their speed for 3 turns (scales with wisdom)',
    cooldown: 2,
    currentCooldown: 0,
    effect: {
        type: 'debuff',
        value: 7,
        targeting: { side: 'enemy', breadth: 'single' },
        duration: 3,
        stat: 'speed',
        scaling: {
            stat: 'wisdom',
            ratio: 0.35,
        },
    },
    icon: GiCrystalBall,
}
