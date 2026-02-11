import type { Ability } from '@/types'
import { GiMagicSwirl } from 'react-icons/gi'

/**
 * Mage: Magic Missile
 * Guaranteed hit
 */
export const MAGIC_MISSILE: Ability = {
    id: 'magic-missile',
    name: 'Magic Missile',
    description: 'Guaranteed hit',
    cooldown: 1,
    currentCooldown: 0,
    effect: {
        type: 'damage',
        value: 15,
        target: 'enemy',
    },
    icon: GiMagicSwirl,
}
