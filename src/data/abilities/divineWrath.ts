import type { Ability } from '@/types'
import { GiHolySymbol } from 'react-icons/gi'

/**
 * Archangel: Divine Wrath
 * Massive holy damage to a single target
 */
export const DIVINE_WRATH: Ability = {
    id: 'divine-wrath',
    name: 'Divine Wrath',
    description: 'Channel holy fire into a devastating single strike (scales with magic power)',
    cooldown: 2,
    currentCooldown: 0,
    effect: {
        type: 'damage',
        value: 25,
        targeting: { side: 'enemy', breadth: 'single' },
        scaling: {
            stat: 'magicPower',
            ratio: 2.0,
        },
    },
    icon: GiHolySymbol,
}
