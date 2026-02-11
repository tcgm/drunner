import type { BossAbility } from '@/types'

export const DEVASTATING_SLAM: BossAbility = {
    id: 'aoe-slam',
    name: 'Devastating Slam',
    description: 'Hits all heroes with massive damage!',
    cooldown: 4,
    lastUsed: -999, // Initialize to allow first-turn use
    trigger: 'onTurnStart', // Checked at start of boss turn
    effects: [
        {
            type: 'damage',
            target: 'all-enemies',
            value: 80,
        },
    ],
}
