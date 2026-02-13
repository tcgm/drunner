/**
 * Boss Combat System - Turn Order Calculation
 * 
 * Calculates and manages turn order based on speed stats
 */

import type { Hero, BossCombatState, Combatant } from '@/types'
import { calculateTotalStats } from '@/utils/statCalculator'
import { recalculateDynamicBossStats } from './bossStats'

/**
 * Calculate turn order for all combatants (heroes + boss)
 * 
 * Turn order is determined by speed stat, highest first.
 * Speed ties are resolved randomly (rare edge case).
 * 
 * @param party - Party of heroes (including dead heroes)
 * @param combatState - Current boss combat state
 * @returns Array of combatants in turn order (highest speed first)
 */
export function calculateTurnOrder(
    party: (Hero | null)[],
    combatState: BossCombatState
): Combatant[] {
    const combatants: Combatant[] = []

    // Add alive heroes to turn order
    party.forEach((hero, index) => {
        if (hero && hero.isAlive) {
            const effectiveStats = calculateTotalStats(hero)

            combatants.push({
                id: hero.id,
                type: 'hero',
                speed: effectiveStats.speed,
                isAlive: true,
            })
        }
    })

    // Add boss to turn order
    const baseStats = {
        baseHp: 0, // Not needed for turn order
        baseAttack: combatState.baseStats.attack,
        baseDefense: combatState.baseStats.defense,
        baseSpeed: combatState.baseStats.speed,
        baseLuck: combatState.baseStats.luck,
    }
    const bossStats = recalculateDynamicBossStats(
        baseStats,
        combatState.floor,
        combatState.depth,
        combatState.combatDepth,
        combatState.currentHp,
        combatState.maxHp,
        combatState.activeEffects
    )

    combatants.push({
        id: 'boss',
        type: 'boss',
        speed: bossStats.speed,
        isAlive: combatState.currentHp > 0,
    })

    // Sort by speed (highest first), with random tiebreaker
    combatants.sort((a, b) => {
        if (b.speed !== a.speed) {
            return b.speed - a.speed
        }
        // Random tiebreaker (extremely rare)
        return Math.random() - 0.5
    })

    return combatants.filter(c => c.isAlive)
}

/**
 * Get hero position based on party slot
 * Slots 0-1 = frontline, Slots 2-3 = backline
 * 
 * @param partyIndex - Index in party array (0-3)
 * @returns Position ('frontline' or 'backline')
 */
export function getHeroPosition(partyIndex: number): 'frontline' | 'backline' {
    return partyIndex <= 1 ? 'frontline' : 'backline'
}

/**
 * Update hero positions in party based on their slots
 * 
 * @param party - Party of heroes
 */
export function updateHeroPositions(party: (Hero | null)[]): void {
    party.forEach((hero, index) => {
        if (hero) {
            hero.position = getHeroPosition(index)
        }
    })
}
