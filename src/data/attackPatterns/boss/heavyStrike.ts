import type { BossAttackPattern } from '@/types'

export const HEAVY_STRIKE: BossAttackPattern = {
    id: 'heavy-strike',
    name: 'Heavy Strike',
    weight: 40, // 40% chance
    attackType: 'single',
    damageMultiplier: 1.5, // 150% of attack stat
    critChance: 0.3, // 30% crit chance for this attack
    description: 'A devastating blow to a single hero!',
}
