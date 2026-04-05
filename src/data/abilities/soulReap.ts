import type { Ability } from '@/types'
import { GiReaperScythe } from 'react-icons/gi'

/**
 * Reaper: Soul Reap
 * Heavy single-target scythe strike
 */
export const SOUL_REAP: Ability = {
    id: 'soul-reap',
    name: 'Soul Reap',
    description: 'Strike with a spectral scythe — lethal single-target damage (scales with attack)',
    cooldown: 1,
    currentCooldown: 0,
    effect: {
        type: 'damage',
        value: 22,
        targeting: { side: 'enemy', breadth: 'single' },
        scaling: {
            stat: 'attack',
            ratio: 2.2,
        },
    },
    icon: GiReaperScythe,
}
