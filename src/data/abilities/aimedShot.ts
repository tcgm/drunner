import type { Ability } from '@/types'
import { GiBullseye } from 'react-icons/gi'

/**
 * Ranger: Aimed Shot
 * High accuracy attack
 */
export const AIMED_SHOT: Ability = {
    id: 'aimed-shot',
    name: 'Aimed Shot',
    description: 'High accuracy attack',
    cooldown: 2,
    currentCooldown: 0,
    effect: {
        type: 'damage',
        value: 20,
        target: 'enemy',
    },
    icon: GiBullseye,
}
