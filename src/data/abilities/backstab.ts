import type { Ability } from '@/types'
import { GiSwordSmithing } from 'react-icons/gi'

/**
 * Rogue: Backstab
 * High single-target damage
 */
export const BACKSTAB: Ability = {
    id: 'backstab',
    name: 'Backstab',
    description: 'High single-target damage (scales with attack)',
    cooldown: 2,
    currentCooldown: 0,
    effect: {
        type: 'damage',
        value: 30,
        target: 'enemy',
        scaling: {
            stat: 'attack',
            ratio: 0.8
        }
    },
    icon: GiSwordSmithing,
}
