import type { Ability } from '@/types'
import { GiMusicalScore } from 'react-icons/gi'

/**
 * Bard: Song of Rest
 * Heal over time to all allies
 */
export const SONG_OF_REST: Ability = {
    id: 'song-of-rest',
    name: 'Song of Rest',
    description: 'Heal over time to all allies (scales with charisma)',
    cooldown: 5,
    currentCooldown: 0,
    effect: {
        type: 'heal',
        value: 8,
        target: 'all-allies',
        duration: 3,
        scaling: {
            stat: 'charisma',
            ratio: 0.4
        }
    },
    icon: GiMusicalScore,
}
