import type { Ability } from '@/types'
import { GiPunch } from 'react-icons/gi'

/**
 * Warrior: Power Strike
 * High damage single attack
 */
export const POWER_STRIKE: Ability = {
    id: 'power-strike',
    name: 'Power Strike',
    description: 'High damage single attack (scales with attack)',
    cooldown: 2,
    currentCooldown: 0,
    effect: {
        type: 'damage',
        value: 40,
        targeting: { side: 'enemy', breadth: 'single' },
        scaling: {
            stat: 'attack',
            ratio: 1.6
        }
    },
    icon: GiPunch,
}
