import type { Ability } from '@/types'
import { GiDodge } from 'react-icons/gi'

/**
 * Rogue: Dodge
 * Avoid next attack
 */
export const DODGE: Ability = {
    id: 'dodge',
    name: 'Dodge',
    description: 'Avoid next attack (scales with luck)',
    cooldown: 3,
    currentCooldown: 0,
    effect: {
        type: 'buff',
        value: 50,
        target: 'self',
        duration: 1,
        scaling: {
            stat: 'luck',
            ratio: 0.5
        }
    },
    icon: GiDodge,
}
