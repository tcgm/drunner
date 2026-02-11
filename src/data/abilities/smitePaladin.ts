import type { Ability } from '@/types'
import { GiHolySymbol } from 'react-icons/gi'

/**
 * Paladin: Smite
 * Holy damage attack
 */
export const SMITE_PALADIN: Ability = {
    id: 'smite',
    name: 'Smite',
    description: 'Holy damage attack',
    cooldown: 2,
    currentCooldown: 0,
    effect: {
        type: 'damage',
        value: 20,
        target: 'enemy',
    },
    icon: GiHolySymbol,
}
