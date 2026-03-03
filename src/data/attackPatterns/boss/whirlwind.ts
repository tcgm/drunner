import type { BossAttackPattern } from '@/types'

export const WHIRLWIND: BossAttackPattern = {
    id: 'whirlwind',
    name: 'Whirlwind Attack',
    weight: 30, // 30% chance
    attackType: 'aoe',
    damageMultiplier: 1.0,
    aoeDamageReduction: 0.6, // 60% damage to all heroes
    description: 'Hits all heroes with reduced damage!',
}
