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
    cooldown: 1,
    currentCooldown: 0,
    effect: {
        type: 'damage',
        value: 35,
        targeting: { side: 'enemy', breadth: 'single' },
        scaling: {
            stat: 'attack',
            ratio: 2.0
        }
    },
    icon: GiSwordSmithing,
}
