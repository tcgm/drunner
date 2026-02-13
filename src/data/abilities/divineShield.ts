import type { Ability } from '@/types'
import { GiArmorUpgrade } from 'react-icons/gi'

/**
 * Paladin: Divine Shield
 * Grant temporary invulnerability
 */
export const DIVINE_SHIELD: Ability = {
    id: 'divine-shield',
    name: 'Divine Shield',
    description: 'Grant temporary invulnerability (scales with wisdom)',
    cooldown: 6,
    currentCooldown: 0,
    effect: {
        type: 'buff',
        value: 50,
        target: 'self',
        duration: 1,        stat: 'defense',        scaling: {
            stat: 'wisdom',
            ratio: 0.5
        }
    },
    icon: GiArmorUpgrade,
}
