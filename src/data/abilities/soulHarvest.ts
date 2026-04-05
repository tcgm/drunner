import type { Ability } from '@/types'
import { GiSoulVessel } from 'react-icons/gi'

/**
 * Reaper: Soul Harvest
 * Drain life from all enemies, healing the caster
 */
export const SOUL_HARVEST: Ability = {
    id: 'soul-harvest',
    name: 'Soul Harvest',
    description: 'Drain the life force of all enemies, restoring the Reaper\'s health (scales with magic power)',
    cooldown: 4,
    currentCooldown: 0,
    effect: {
        type: 'special',
        value: 12,
        targeting: { side: 'enemy', breadth: 'all' },
        scaling: {
            stat: 'magicPower',
            ratio: 1.2,
        },
    },
    icon: GiSoulVessel,
}
