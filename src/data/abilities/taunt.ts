import type { Ability } from '@/types'
import { GiScreaming } from 'react-icons/gi'

/**
 * Warrior: Taunt
 * Force the boss to focus attacks on this hero.
 * Duration and defense boost scale with the hero's primary stat (defense for Warriors).
 */
export const TAUNT: Ability = {
    id: 'taunt',
    name: 'Taunt',
    description: 'Force boss to target you for 2-4 turns and gain bonus defense (scales with primary stat)',
    cooldown: 4,
    currentCooldown: 0,
    effect: {
        type: 'special',
        value: 0,      // computed dynamically from primary stat in heroAbilities.ts
        targeting: { side: 'self', breadth: 'single' },
        duration: 2,   // base duration; extended by primary stat
        scaling: { stat: 'defense', ratio: 0.2 }, // matches defenseBonus calc in heroAbilities.ts
    },
    icon: GiScreaming,
}
