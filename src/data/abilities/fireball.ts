import type { Ability } from '@/types'
import { GiFireball } from 'react-icons/gi'

/**
 * Mage: Fireball
 * Magic damage to enemy and applies 2 stacks of Burning DoT to the boss
 */
export const FIREBALL: Ability = {
    id: 'fireball',
    name: 'Fireball',
    description: 'Magic damage to enemy (scales with magic power). Applies 2 stacks of Burning (30 dmg/turn, 3 rounds).',
    cooldown: 2,
    currentCooldown: 0,
    effect: {
        type: 'damage',
        value: 25,
        targeting: { side: 'enemy', breadth: 'single' },
        scaling: {
            stat: 'magicPower',
            ratio: 1.7
        },
        burnStacks: 2,
    },
    icon: GiFireball,
}
