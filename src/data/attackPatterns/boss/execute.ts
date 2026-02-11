import type { BossAttackPattern, BossCombatState, Hero } from '@/types'

export const EXECUTE: BossAttackPattern = {
    id: 'execute',
    name: 'Execute',
    weight: 10, // 10% chance
    attackType: 'single',
    damageMultiplier: 3.0, // 300% damage!
    critChance: 1.0, // Guaranteed crit
    description: 'A finishing blow targeting wounded heroes!',
    condition: (state: BossCombatState, party: Hero[]) => {
        // Only use when a hero is below 30% HP
        return party.some(h => h && h.isAlive && h.stats.hp < h.stats.maxHp * 0.3)
    },
}
