import type { Ability } from '@/types'

/**
 * Bard: Song of Rest
 * Heal over time to all allies
 */
export const SONG_OF_REST: Ability = {
    id: 'song-of-rest',
    name: 'Song of Rest',
    description: 'Heal over time to all allies',
    cooldown: 5,
    currentCooldown: 0,
    effect: {
        type: 'heal',
        value: 10,
        target: 'all-allies',
        duration: 3,
    },
    icon: 'GiMusicalScore',
}
