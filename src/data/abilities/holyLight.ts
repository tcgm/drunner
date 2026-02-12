import type { Ability } from '@/types'
import { GiSunbeams } from 'react-icons/gi'

/**
 * Cleric: Holy Light
 * Damage enemy with holy energy
 */
export const HOLY_LIGHT: Ability = {
    id: 'holy-light',
    name: 'Holy Light',
    description: 'Damage enemy with holy energy (scales with magic power)',
    cooldown: 3,
    currentCooldown: 0,
    effect: {
        type: 'damage',
        value: 20,
        target: 'enemy',
        scaling: {
            stat: 'magicPower',
            ratio: 0.6
        }
    },
    icon: GiSunbeams,
}
