import type { Ability } from '@/types'
import { GiPoisonBottle } from 'react-icons/gi'

/**
 * Rogue: Poison Blade
 * Apply poison damage over time to the boss
 */
export const POISON_BLADE: Ability = {
    id: 'poison-blade',
    name: 'Poison Blade',
    description: 'Apply poison for 3 turns (scales with luck)',
    cooldown: 3,
    currentCooldown: 0,
    effect: {
        type: 'special',
        value: 5,
        targeting: { side: 'enemy', breadth: 'single' },
        duration: 3,
        scaling: {
            stat: 'luck',
            ratio: 0.2,
        },
    },
    icon: GiPoisonBottle,
}
