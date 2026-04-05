import type { Ability } from '@/types'
import { GiStarKey } from 'react-icons/gi'

/**
 * Trickster: Wild Luck
 * Push luck to absurd heights, bending fate in your favor
 */
export const WILD_LUCK: Ability = {
    id: 'wild-luck',
    name: 'Wild Luck',
    description: 'Stack the deck — greatly boosts own luck for 3 turns (scales with charisma)',
    cooldown: 4,
    currentCooldown: 0,
    effect: {
        type: 'buff',
        value: 12,
        targeting: { side: 'self', breadth: 'single' },
        duration: 3,
        stat: 'luck',
        scaling: {
            stat: 'charisma',
            ratio: 0.4,
        },
    },
    icon: GiStarKey,
}
