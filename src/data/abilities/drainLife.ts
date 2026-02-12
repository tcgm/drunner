import type { Ability } from '@/types'
import { GiVampireDracula } from 'react-icons/gi'

/**
 * Necromancer: Drain Life
 * Damage enemy and heal self
 */
export const DRAIN_LIFE: Ability = {
    id: 'drain-life',
    name: 'Drain Life',
    description: 'Damage enemy and heal self (scales with magic power)',
    cooldown: 2,
    currentCooldown: 0,
    effect: {
        type: 'special',
        value: 15,
        target: 'enemy',
        scaling: {
            stat: 'magicPower',
            ratio: 0.5
        }
    },
    icon: GiVampireDracula,
}
