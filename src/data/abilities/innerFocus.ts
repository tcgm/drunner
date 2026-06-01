import type { Ability } from '@/types'
import { GiMeditation } from 'react-icons/gi'

/**
 * Monk: Inner Focus
 * Meditative self-buff that sharpens attack and speed
 */
export const INNER_FOCUS: Ability = {
    id: 'inner-focus',
    name: 'Inner Focus',
    description: 'Enter a focused state, gaining attack for 2 turns (scales with wisdom)',
    cooldown: 3,
    currentCooldown: 0,
    effect: {
        type: 'buff',
        value: 20,
        targeting: { side: 'self', breadth: 'single' },
        duration: 2,
        stat: 'attack',
        scaling: {
            stat: 'wisdom',
            ratio: 0.8,
        },
    },
    icon: GiMeditation,
}
