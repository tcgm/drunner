import type { Ability } from '@/types'
import { GiSparkles } from 'react-icons/gi'

/**
 * Archangel: Radiant Heal
 * Restore all party members' health
 */
export const RADIANT_HEAL: Ability = {
    id: 'radiant-heal',
    name: 'Radiant Heal',
    description: 'Flood the party with healing light, restoring health to all members (scales with wisdom)',
    cooldown: 4,
    currentCooldown: 0,
    effect: {
        type: 'heal',
        value: 20,
        targeting: { side: 'party', breadth: 'all' },
        scaling: {
            stat: 'wisdom',
            ratio: 1.5,
        },
    },
    icon: GiSparkles,
}
