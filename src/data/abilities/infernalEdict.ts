import type { Ability } from '@/types'
import { GiFlame } from 'react-icons/gi'

/**
 * Archdevil: Infernal Edict
 * Devastating strike that leaves a burning curse
 */
export const INFERNAL_EDICT: Ability = {
    id: 'infernal-edict',
    name: 'Infernal Edict',
    description: 'Decree a target\'s burning end — heavy damage plus Hellfire DoT (scales with attack)',
    cooldown: 3,
    currentCooldown: 0,
    effect: {
        type: 'damage',
        value: 30,
        targeting: { side: 'enemy', breadth: 'single' },
        scaling: {
            stat: 'attack',
            ratio: 2.5,
        },
        dot: {
            name: 'Hellfire',
            damage: 8,
            duration: 3,
            stacking: 'replace',
        },
    },
    icon: GiFlame,
}
