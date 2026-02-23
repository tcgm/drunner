import type { Ability } from '@/types'
import { GiPoisonBottle } from 'react-icons/gi'

/**
 * Rogue: Poison Blade
 * Apply poison damage over time to the boss
 */
export const POISON_BLADE: Ability = {
    id: 'poison-blade',
    name: 'Poison Blade',
    description: 'Poisons the boss for 3 turns (5 + 20% luck dmg/turn). Re-applying refreshes the effect.',
    cooldown: 3,
    currentCooldown: 0,
    effect: {
        type: 'special',
        value: 5,
        targeting: { side: 'enemy', breadth: 'single' },
        duration: 3,
        dot: {
            name: 'Poisoned',
            damage: 5,
            duration: 3,
            stacking: 'replace',
            scaling: {
                stat: 'luck',
                ratio: 0.2,
            },
        },
    },
    icon: GiPoisonBottle,
}
