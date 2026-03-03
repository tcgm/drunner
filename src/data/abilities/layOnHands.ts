import type { Ability } from '@/types'
import { GiHealing } from 'react-icons/gi'

/**
 * Paladin: Lay on Hands
 * Heal ally
 */
export const LAY_ON_HANDS: Ability = {
    id: 'lay-on-hands',
    name: 'Lay on Hands',
    description: 'Heal self or ally (scales with wisdom)',
    cooldown: 4,
    currentCooldown: 0,
    effect: {
        type: 'heal',
        value: 15,
        targeting: { side: 'ally', breadth: 'single', priority: 'lowest', priorityStat: 'hpPercent', includesSelf: true },
        scaling: {
            stat: 'wisdom',
            ratio: 0.5
        }
    },
    icon: GiHealing,
}
