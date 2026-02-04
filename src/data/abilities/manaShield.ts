import type { Ability } from '@/types'

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
