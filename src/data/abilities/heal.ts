import type { Ability } from '@/types'
import { GiHealing } from 'react-icons/gi'

/**
 * Cleric: Heal
 * Restore ally HP
 */
export const HEAL: Ability = {
    id: 'heal',
    name: 'Heal',
    description: 'Restore ally HP (scales with wisdom)',
    cooldown: 2,
    currentCooldown: 0,
    effect: {
        type: 'heal',
        value: 20,
        target: 'ally',
        scaling: {
            stat: 'wisdom',
            ratio: 0.5
        }
    },
    icon: GiHealing,
}
