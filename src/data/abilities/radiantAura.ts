import type { Ability } from '@/types'
import { GiAngelWings } from 'react-icons/gi'

/**
 * Archangel: Radiant Aura
 * Bathe the entire party in protective divine light
 */
export const RADIANT_AURA: Ability = {
    id: 'radiant-aura',
    name: 'Radiant Aura',
    description: 'Shield all allies in divine light, boosting their defense for 3 turns (scales with wisdom)',
    cooldown: 3,
    currentCooldown: 0,
    effect: {
        type: 'buff',
        value: 8,
        targeting: { side: 'party', breadth: 'all' },
        duration: 3,
        stat: 'defense',
        scaling: {
            stat: 'wisdom',
            ratio: 0.4,
        },
    },
    icon: GiAngelWings,
}
