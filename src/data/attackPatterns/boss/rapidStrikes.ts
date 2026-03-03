import type { BossAttackPattern } from '@/types'

export const RAPID_STRIKES: BossAttackPattern = {
    id: 'rapid-strikes',
    name: 'Rapid Strikes',
    weight: 20, // 20% chance
    attackType: 'multi',
    damageMultiplier: 0.7, // 70% damage per hit
    targetCount: 3, // Hits 3 times
    description: 'Multiple rapid attacks against random heroes!',
}
