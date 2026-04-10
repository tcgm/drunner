import type { Ability } from '@/types'
import { GiEarthSpit } from 'react-icons/gi'

/**
 * Shaman: Earth Shatter
 * Slam the earth with elemental fury, dealing AoE damage to all enemies and weakening their attack.
 */
export const EARTH_SHATTER: Ability = {
    id: 'earth-shatter',
    name: 'Earth Shatter',
    description: 'Shatter the earth with elemental fury, hitting all enemies and weakening their attack for 2 turns (scales with magic power).',
    cooldown: 4,
    currentCooldown: 0,
    effect: {
        type: 'damage',
        value: 14,
        targeting: { side: 'enemy', breadth: 'all' },
        scaling: {
            stat: 'magicPower',
            ratio: 0.9,
        },
    },
    icon: GiEarthSpit,
}
