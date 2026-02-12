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
        value: 20,
        target: 'enemy',
        scaling: {
            stat: 'attack',
            ratio: 0.6
        }
    },
    icon: GiPunch,
}
