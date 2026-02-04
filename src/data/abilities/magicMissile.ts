import type { Ability } from '@/types'

/**
 * Mage: Magic Missile
 * Guaranteed hit magical attack
 */
export const MAGIC_MISSILE: Ability = {
    id: 'magic-missile',
    name: 'Magic Missile',
    description: 'Guaranteed hit magical attack',
    cooldown: 1,
    currentCooldown: 0,
    effect: {
        type: 'damage',
        value: 15,
        target: 'enemy',
    },
    icon: 'GiMagicSwirl',
}
