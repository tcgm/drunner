import type { Ability } from '@/types'
import { GiWingedSword } from 'react-icons/gi'

/**
 * Archangel: Holy Blade
 * Smite a single enemy with a divine-edged strike
 */
export const HOLY_BLADE: Ability = {
    id: 'holy-blade',
    name: 'Holy Blade',
    description: 'Strike with a heaven-forged blade (scales with attack)',
    cooldown: 1,
    currentCooldown: 0,
    effect: {
        type: 'damage',
        value: 25,
        targeting: { side: 'enemy', breadth: 'single' },
        scaling: {
            stat: 'attack',
            ratio: 2.0,
        },
    },
    icon: GiWingedSword,
}
