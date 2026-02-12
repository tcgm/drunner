import type { Ability } from '@/types'
import { GiMagicSwirl } from 'react-icons/gi'

/**
 * Mage: Magic Missile
 * Guaranteed hit
 */
export const MAGIC_MISSILE: Ability = {
    id: 'magic-missile',
    name: 'Magic Missile',
    description: 'Guaranteed hit (scales with magic power)',
    cooldown: 1,
    currentCooldown: 0,
    effect: {
        type: 'damage',
        value: 15,
        target: 'enemy',
        scaling: {
            stat: 'magicPower',
            ratio: 0.5
        }
    },
    icon: GiMagicSwirl,
}
