import type { Ability } from '@/types'

/**
 * Paladin: Lay on Hands
 * Heal self or ally
 */
export const LAY_ON_HANDS: Ability = {
    id: 'lay-on-hands',
    name: 'Lay on Hands',
    description: 'Heal self or ally',
    cooldown: 4,
    currentCooldown: 0,
    effect: {
        type: 'heal',
        value: 20,
        target: 'ally',
    },
    icon: 'GiHeal',
}
