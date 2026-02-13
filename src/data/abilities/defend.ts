import type { Ability } from '@/types'
import { GiShield } from 'react-icons/gi'

/**
 * Warrior: Defend
 * Reduce incoming damage this turn
 */
export const DEFEND: Ability = {
    id: 'defend',
    name: 'Defend',
    description: 'Reduce incoming damage (scales with defense)',
    cooldown: 3,
    cooldownType: 'depth',
    currentCooldown: 0,
    effect: {
        type: 'buff',
        value: 5,
        target: 'self',
        duration: 1,
        stat: 'defense',
        scaling: {
            stat: 'defense',
            ratio: 0.5
        }
    },
    icon: GiShield,
}
