import type { Ability } from '@/types'
import { GiBullseye } from 'react-icons/gi'

/**
 * Ranger: Aimed Shot
 * High accuracy attack
 */
export const AIMED_SHOT: Ability = {
    id: 'aimed-shot',
    name: 'Aimed Shot',
    description: 'Slow, heavy-hitting attack (scales with attack)',
    cooldown: 2,
    currentCooldown: 0,
    effect: {
        type: 'damage',
        value: 30,
        targeting: { side: 'enemy', breadth: 'single' },
        scaling: {
            stat: 'attack',
            ratio: 4.0
        }
    },
    icon: GiBullseye,
}
