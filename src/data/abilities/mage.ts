import type { Ability } from '@/types'

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
    icon: 'GiFireball',
}

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

/**
 * Mage: Mana Shield
 * Temporary magical protection
 */
export const MANA_SHIELD: Ability = {
    id: 'mana-shield',
    name: 'Mana Shield',
    description: 'Temporary magical protection',
    cooldown: 4,
    currentCooldown: 0,
    effect: {
        type: 'buff',
        value: 15,
        target: 'self',
        duration: 2,
    },
    icon: 'GiMagicShield',
}
