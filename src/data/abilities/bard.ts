import type { Ability } from '@/types'

/**
 * Bard: Inspire
 * Buff all allies
 */
export const INSPIRE: Ability = {
    id: 'inspire',
    name: 'Inspire',
    description: 'Buff all allies',
    cooldown: 4,
    currentCooldown: 0,
    effect: {
        type: 'buff',
        value: 3,
        target: 'all-allies',
        duration: 3,
    },
    icon: 'GiMusicalNotes',
}

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

/**
 * Bard: Discordant Note
 * Debuff enemy stats
 */
export const DISCORDANT_NOTE: Ability = {
    id: 'discordant-note',
    name: 'Discordant Note',
    description: 'Debuff enemy stats',
    cooldown: 3,
    currentCooldown: 0,
    effect: {
        type: 'debuff',
        value: 4,
        target: 'enemy',
        duration: 2,
    },
    icon: 'GiMicrophone',
}
