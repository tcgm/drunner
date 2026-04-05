import type { Ability } from '@/types'
import { GiDread } from 'react-icons/gi'

/**
 * Archdevil: Corrupt Soul
 * Taint an enemy's fighting spirit, reducing their attack
 */
export const CORRUPT_SOUL: Ability = {
    id: 'corrupt-soul',
    name: 'Corrupt Soul',
    description: 'Taint an enemy\'s fighting spirit, reducing their attack for 3 turns (scales with magic power)',
    cooldown: 3,
    currentCooldown: 0,
    effect: {
        type: 'debuff',
        value: 10,
        targeting: { side: 'enemy', breadth: 'single' },
        duration: 3,
        stat: 'attack',
        scaling: {
            stat: 'magicPower',
            ratio: 0.4,
        },
    },
    icon: GiDread,
}
