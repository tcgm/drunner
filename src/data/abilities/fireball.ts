import type { Ability } from '@/types'
import { GiFireball } from 'react-icons/gi'

/**
 * Mage: Fireball
 * Magic damage to enemy
 */
export const FIREBALL: Ability = {
    id: 'fireball',
    name: 'Fireball',
    description: 'Magic damage to enemy',
    cooldown: 2,
    currentCooldown: 0,
    effect: {
        type: 'damage',
        value: 25,
        target: 'enemy',
    },
    icon: GiFireball,
}
