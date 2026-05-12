import type { Ability } from '@/types'
import { GiSpikedTentacle as GiSpikyTentacle } from 'react-icons/gi'

/**
 * Druid: Entangle
 * Bind the enemy in roots, reducing their speed for several turns.
 */
export const ENTANGLE: Ability = {
    id: 'entangle',
    name: 'Entangle',
    description: 'Bind the enemy in roots, drastically reducing their speed for 3 turns (scales with wisdom).',
    cooldown: 4,
    currentCooldown: 0,
    effect: {
        type: 'debuff',
        value: 8,
        targeting: { side: 'enemy', breadth: 'single' },
        duration: 3,
        stat: 'speed',
        scaling: {
            stat: 'wisdom',
            ratio: 0.4,
        },
    },
    icon: GiSpikyTentacle,
}
