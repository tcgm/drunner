import type { Ability } from '@/types'
import { GiCursedStar } from 'react-icons/gi'

/**
 * Necromancer: Curse
 * Debuff enemy stats
 */
export const CURSE: Ability = {
    id: 'curse',
    name: 'Curse',
    description: 'Debuff enemy stats (scales with magic power)',
    cooldown: 3,
    currentCooldown: 0,
    effect: {
        type: 'debuff',
        value: 5,
        target: 'enemy',
        duration: 2,
        stat: 'attack',
        scaling: {
            stat: 'magicPower',
            ratio: 0.3
        }
    },
    icon: GiCursedStar,
}
