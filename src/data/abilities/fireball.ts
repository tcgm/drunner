import type { Ability } from '@/types'
import { GiFireball } from 'react-icons/gi'

/**
 * Mage: Fireball
 * Magic damage to enemy and applies a Burning DoT to the boss
 */
export const FIREBALL: Ability = {
    id: 'fireball',
    name: 'Fireball',
    description: 'Magic damage to enemy (scales with magic power). Applies Burning (40+35% magic dmg/turn, 3 rounds, additive stacking).',
    cooldown: 2,
    currentCooldown: 0,
    effect: {
        type: 'damage',
        value: 50,
        targeting: { side: 'enemy', breadth: 'single' },
        scaling: {
            stat: 'magicPower',
            ratio: 1.2
        },
        dot: {
            name: 'Burning',
            damage: 40,
            duration: 3,
            stacking: 'additive',
            scaling: {
                stat: 'magicPower',
                ratio: 0.35,
            },
        },
    },
    icon: GiFireball,
}
