import type { Ability } from '@/types'
import { GiFireRing } from 'react-icons/gi'

/**
 * Archdevil: Wrath of Sin
 * Unleash infernal fury on all enemies at once
 */
export const WRATH_OF_SIN: Ability = {
    id: 'wrath-of-sin',
    name: 'Wrath of Sin',
    description: 'Unleash infernal fury across all enemies (scales with attack)',
    cooldown: 5,
    currentCooldown: 0,
    effect: {
        type: 'damage',
        value: 20,
        targeting: { side: 'enemy', breadth: 'all' },
        scaling: {
            stat: 'attack',
            ratio: 1.5,
        },
    },
    icon: GiFireRing,
}
