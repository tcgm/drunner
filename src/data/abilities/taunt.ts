import type { Ability } from '@/types'
import { GiScreaming } from 'react-icons/gi'

/**
 * Warrior: Taunt
 * Draw enemy attention
 */
export const TAUNT: Ability = {
    id: 'taunt',
    name: 'Taunt',
    description: 'Draw enemy attention',
    cooldown: 4,
    currentCooldown: 0,
    effect: {
        type: 'debuff',
        value: 0,
        target: 'enemy',
        duration: 2,
    },
    icon: GiScreaming,
}
