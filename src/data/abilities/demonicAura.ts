import type { Ability } from '@/types'
import { GiCrownedSkull } from 'react-icons/gi'

/**
 * Archdevil: Demonic Aura
 * Emanate infernal power, boosting the entire party's attack
 */
export const DEMONIC_AURA: Ability = {
    id: 'demonic-aura',
    name: 'Demonic Aura',
    description: 'Radiate overwhelming infernal power — boosts attack for the entire party (scales with charisma)',
    cooldown: 4,
    currentCooldown: 0,
    effect: {
        type: 'buff',
        value: 8,
        targeting: { side: 'party', breadth: 'all' },
        duration: 2,
        stat: 'attack',
        scaling: {
            stat: 'charisma',
            ratio: 0.3,
        },
    },
    icon: GiCrownedSkull,
}
