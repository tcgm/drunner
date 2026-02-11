import type { BossAbility } from '@/types'

export const REGENERATION: BossAbility = {
    id: 'regenerate',
    name: 'Regeneration',
    description: 'The boss recovers health!',
    cooldown: 5,
    lastUsed: -999, // Initialize to allow first-turn use
    trigger: 'always', // Happens every turn (respecting cooldown)
    effects: [
        {
            type: 'heal',
            target: 'self',
            value: 100,
        },
    ],
}
