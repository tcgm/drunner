import type { Ability } from '@/types'

/**
 * Necromancer: Drain Life
 * Damage enemy and heal self
 */
export const DRAIN_LIFE: Ability = {
    id: 'drain-life',
    name: 'Drain Life',
    description: 'Damage enemy and heal self',
    cooldown: 2,
    currentCooldown: 0,
    effect: {
        type: 'damage',
        value: 15,
        target: 'enemy',
    },
    icon: 'GiVampireDracula',
}
