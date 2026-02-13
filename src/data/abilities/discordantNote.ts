import type { Ability } from '@/types'
import { GiMicrophone } from 'react-icons/gi'

/**
 * Bard: Discordant Note
 * Debuff enemy stats
 */
export const DISCORDANT_NOTE: Ability = {
    id: 'discordant-note',
    name: 'Discordant Note',
    description: 'Debuff enemy stats (scales with charisma)',
    cooldown: 3,
    currentCooldown: 0,
    effect: {
        type: 'debuff',
        value: 4,
        target: 'enemy',
        duration: 2,        stat: 'attack',        scaling: {
            stat: 'charisma',
            ratio: 0.2
        }
    },
    icon: GiMicrophone,
}
