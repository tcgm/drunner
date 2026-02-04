import type { Ability } from '@/types'

/**
 * Paladin: Divine Shield
 * Temporary invulnerability
 */
export const DIVINE_SHIELD: Ability = {
    id: 'divine-shield',
    name: 'Divine Shield',
    description: 'Temporary invulnerability',
    cooldown: 6,
    currentCooldown: 0,
    effect: {
        type: 'buff',
        value: 999,
        target: 'self',
        duration: 1,
    },
    icon: 'GiArmorUpgrade',
}
