import type { Ability } from '@/types'

/**
 * Cleric: Heal
 * Restore ally HP
 */
export const HEAL: Ability = {
    id: 'heal',
    name: 'Heal',
    description: 'Restore ally HP',
    cooldown: 2,
    currentCooldown: 0,
    effect: {
        type: 'heal',
        value: 30,
        target: 'ally',
    },
    icon: 'GiHealing',
}
