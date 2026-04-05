import type { Ability } from '@/types'
import { GiDeathNote } from 'react-icons/gi'

/**
 * Reaper: Death Mark
 * Brand an enemy — reduces their defense for several rounds
 */
export const DEATH_MARK: Ability = {
    id: 'death-mark',
    name: 'Death Mark',
    description: 'Brand an enemy for death — reduces their defense for 3 turns (scales with wisdom)',
    cooldown: 3,
    currentCooldown: 0,
    effect: {
        type: 'debuff',
        value: 8,
        targeting: { side: 'enemy', breadth: 'single' },
        duration: 3,
        stat: 'defense',
        scaling: {
            stat: 'wisdom',
            ratio: 0.4,
        },
    },
    icon: GiDeathNote,
}
