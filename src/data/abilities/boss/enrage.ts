import type { BossAbility } from '@/types'

export const ENRAGE: BossAbility = {
    id: 'enrage',
    name: 'Enrage',
    description: 'The boss enters a rage, gaining bonus attack!',
    cooldown: 3, // Can use every 3 turns
    lastUsed: -999, // Initialize to allow first-turn use
    trigger: 'onHpThreshold',
    hpThreshold: 0.5, // Triggers at 50% HP
    effects: [
        {
            type: 'buff',
            value: 50,
            target: 'self',
            duration: 999, // Permanent for rest of combat
            stat: 'attack',
        },
    ],
}
