import type { Ability } from '@/types'
import { GiBowArrow } from 'react-icons/gi'

/**
 * Ranger: Quick Shot
 * Fast, lower damage attack
 */
export const QUICK_SHOT: Ability = {
    id: 'quick-shot',
    name: 'Quick Shot',
    description: 'Fast, lower damage attack (scales with attack)',
    cooldown: 1,
    currentCooldown: 0,
    effect: {
        type: 'damage',
        value: 12,
        target: 'enemy',
        scaling: {
            stat: 'attack',
            ratio: 0.5
        }
    },
    icon: GiBowArrow,
}
