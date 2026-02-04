import type { Ability } from '@/types'

/**
 * Ranger: Quick Shot
 * Fast, lower damage attack
 */
export const QUICK_SHOT: Ability = {
    id: 'quick-shot',
    name: 'Quick Shot',
    description: 'Fast, lower damage attack',
    cooldown: 1,
    currentCooldown: 0,
    effect: {
        type: 'damage',
        value: 12,
        target: 'enemy',
    },
    icon: 'GiBowArrow',
}
