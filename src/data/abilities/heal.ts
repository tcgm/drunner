import type { Ability } from '@/types'
import { GiHealing } from 'react-icons/gi'

/**
 * Cleric: Heal
 * Restore ally HP
 */
export const HEAL: Ability = {
    id: 'heal',
    name: 'Heal',
    description: 'Restore ally HP (scales with magic power)',
    cooldown: 2,
    cooldownType: 'depth',
    currentCooldown: 0,
    effect: {
        type: 'heal',
        value: 20,
        target: 'ally',
        scaling: {
            stat: 'magicPower',
            ratio: 0.5
        }
    },
    icon: GiHealing,
}