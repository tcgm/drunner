import type { Ability } from '@/types'
import { GiHolySymbol } from 'react-icons/gi'

/**
 * Paladin: Smite
 * Holy damage attack
 */
export const SMITE_PALADIN: Ability = {
    id: 'smite',
    name: 'Smite',
    description: 'Holy damage attack that scales with Wisdom',
    cooldown: 2,
    currentCooldown: 0,
    effect: {
        type: 'damage',
        value: 20,
        targeting: { side: 'enemy', breadth: 'single' },
        scaling: { stat: 'wisdom', ratio: 1.0 },
    },
    icon: GiHolySymbol,
}
