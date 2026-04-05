import type { Ability } from '@/types'
import { GiEvilEyes } from 'react-icons/gi'

/**
 * Trickster: Jinx
 * Curse an enemy with terrible fortune
 */
export const JINX: Ability = {
    id: 'jinx',
    name: 'Jinx',
    description: 'Sour an enemy\'s luck — reduces their luck stat for 3 turns (scales with luck)',
    cooldown: 3,
    currentCooldown: 0,
    effect: {
        type: 'debuff',
        value: 8,
        targeting: { side: 'enemy', breadth: 'single' },
        duration: 3,
        stat: 'luck',
        scaling: {
            stat: 'luck',
            ratio: 0.4,
        },
    },
    icon: GiEvilEyes,
}
