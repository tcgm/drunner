import type { Ability } from '@/types'
import { GiFireball } from 'react-icons/gi'

/**
 * Mage: Fireball
 * Magic damage to enemy and applies a Burning DoT to the boss
 */
export const FIREBALL: Ability = {
    id: 'fireball',
    name: 'Fireball',
    description: 'Magic damage to enemy (scales with magic power). Applies Burning (30+40% magic dmg/turn, 3 rounds, additive stacking).',
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
        dot: {
            name: 'Burning',
            damage: 30,
            duration: 3,
            stacking: 'additive',
            scaling: {
                stat: 'magicPower',
                ratio: 0.4,
            },
        },
    },
    icon: GiFireball,
}
