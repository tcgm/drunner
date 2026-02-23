import type { Ability } from '@/types'
import { GiFootprint } from 'react-icons/gi'

/**
 * Ranger: Track
 * Reveal event information
 */
export const TRACK: Ability = {
    id: 'track',
    name: 'Track',
    description: "Expose the boss's weakness, reducing their defense — scales with Luck",
    cooldown: 5,
    currentCooldown: 0,
    effect: {
        type: 'special',
        value: 5,
        targeting: { side: 'self', breadth: 'single' },
        scaling: { stat: 'luck', ratio: 0.3 },
    },
    icon: GiFootprint,
}
