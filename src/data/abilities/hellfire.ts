import type { Ability } from '@/types'
import { GiFireSpellCast } from 'react-icons/gi'

/**
 * Archdevil: Hellfire
 * Scorch a single target with unholy flame and leave them burning
 */
export const HELLFIRE: Ability = {
    id: 'hellfire',
    name: 'Hellfire',
    description: 'Scorch an enemy with unholy flame and leave them burning (scales with magic power)',
    cooldown: 2,
    currentCooldown: 0,
    effect: {
        type: 'damage',
        value: 18,
        targeting: { side: 'enemy', breadth: 'single' },
        scaling: {
            stat: 'magicPower',
            ratio: 1.8,
        },
        dot: {
            name: 'Hellfire',
            damage: 8,
            duration: 3,
            stacking: 'replace',
            scaling: { stat: 'magicPower', ratio: 0.3 },
        },
    },
    icon: GiFireSpellCast,
}
