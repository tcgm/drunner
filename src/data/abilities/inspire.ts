import type { Ability } from '@/types'
import { GiMusicalNotes } from 'react-icons/gi'

/**
 * Bard: Inspire
 * Buff all allies
 */
export const INSPIRE: Ability = {
    id: 'inspire',
    name: 'Inspire',
    description: 'Buff all allies (scales with charisma)',
    cooldown: 4,
    currentCooldown: 0,
    effect: {
        type: 'buff',
        value: 3,
        target: 'all-allies',
        duration: 2,
        scaling: {
            stat: 'charisma',
            ratio: 0.2
        }
    },
    icon: GiMusicalNotes,
}
