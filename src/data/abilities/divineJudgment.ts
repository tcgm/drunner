import type { Ability } from '@/types'
import { GiLightningStorm } from 'react-icons/gi'

/**
 * Archangel: Divine Judgment
 * Call down heaven's verdict — overwhelming damage to one target
 */
export const DIVINE_JUDGMENT: Ability = {
    id: 'divine-judgment',
    name: 'Divine Judgment',
    description: 'Call down heaven\'s verdict on a single target (scales with wisdom)',
    cooldown: 4,
    currentCooldown: 0,
    effect: {
        type: 'damage',
        value: 30,
        targeting: { side: 'enemy', breadth: 'single' },
        scaling: {
            stat: 'wisdom',
            ratio: 2.5,
        },
    },
    icon: GiLightningStorm,
}
