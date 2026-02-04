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
