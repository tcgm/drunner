import type { Ability } from '@/types'
import { GiVines } from 'react-icons/gi'

/**
 * Druid: Thorn Whip
 * Lash an enemy with a vine, dealing nature damage and applying a Poison DoT.
 */
export const THORN_WHIP: Ability = {
    id: 'thorn-whip',
    name: 'Thorn Whip',
    description: 'Lash an enemy with a thorned vine, dealing nature damage and poisoning them (scales with magic power).',
    cooldown: 2,
    currentCooldown: 0,
    effect: {
        type: 'damage',
        value: 18,
        targeting: { side: 'enemy', breadth: 'single' },
        scaling: {
            stat: 'magicPower',
            ratio: 1.3,
        },
        dot: {
            name: 'Poisoned',
            damage: 15,
            duration: 3,
            stacking: 'additive',
            scaling: {
                stat: 'magicPower',
                ratio: 0.3,
            },
        },
    },
    icon: GiVines,
}
