import type { Ability } from '@/types'
import { GiSpellBook } from 'react-icons/gi'

/**
 * Oracle: Revelation
 * A moment of divine clarity — surges the party's wisdom
 */
export const REVELATION: Ability = {
    id: 'revelation',
    name: 'Revelation',
    description: 'Flood all allies with divine clarity, massively boosting their wisdom for 2 turns (scales with wisdom)',
    cooldown: 5,
    currentCooldown: 0,
    effect: {
        type: 'buff',
        value: 12,
        targeting: { side: 'party', breadth: 'all' },
        duration: 2,
        stat: 'wisdom',
        scaling: {
            stat: 'wisdom',
            ratio: 0.5,
        },
    },
    icon: GiSpellBook,
}
