import type { Ability } from '@/types'
import { GiFootprint } from 'react-icons/gi'

/**
 * Ranger: Track
 * Reveal event information
 */
export const TRACK: Ability = {
    id: 'track',
    name: 'Track',
    description: 'Reveal event information',
    cooldown: 5,
    currentCooldown: 0,
    effect: {
        type: 'special',
        value: 0,
        target: 'self',
    },
    icon: GiFootprint,
}
