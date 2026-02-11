import type { Ability } from '@/types'
import { GiMagicShield } from 'react-icons/gi'

/**
 * Mage: Mana Shield
 * Temporary magic protection
 */
export const MANA_SHIELD: Ability = {
    id: 'mana-shield',
    name: 'Mana Shield',
    description: 'Temporary magic protection (scales with wisdom)',
    cooldown: 4,
    currentCooldown: 0,
    effect: {
        type: 'buff',
        value: 10,
        target: 'self',
        duration: 2,
        scaling: {
            stat: 'wisdom',
            ratio: 0.5
        }
    },
    icon: GiMagicShield,
}
