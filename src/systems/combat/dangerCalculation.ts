/**
 * Boss Combat System - Danger Calculation
 * 
 * Calculates effective danger level based on floor, depth, and combat depth
 */

import { GAME_CONFIG } from '@/config/gameConfig'

/**
 * Calculate effective danger level for boss scaling
 * 
 * @param floor - Current floor (1-100)
 * @param depth - Total events completed
 * @param combatDepth - Turns in current combat (0 at combat start)
 * @returns Effective danger level (used for boss stat scaling)
 * 
 * @example
 * // Floor 1, 0 events, Turn 0
 * calculateDanger(1, 0, 0) // 1.0
 * 
 * // Floor 10, 50 events, Turn 10
 * calculateDanger(10, 50, 10) // 10 + (50 * 0.05) + (10 * 0.05) = 13.0
 * 
 * // Floor 50, 300 events, Turn 20
 * calculateDanger(50, 300, 20) // 50 + (300 * 0.05) + (20 * 0.05) = 66.0
 */
export function calculateDanger(
    floor: number,
    depth: number,
    combatDepth: number
): number {
    const weights = GAME_CONFIG.combat.turnBased.dangerWeights

    return (
        floor * weights.floor +
        depth * weights.depth +
        combatDepth * weights.combatDepth
    )
}

/**
 * Apply first boss scaling reduction for tutorial boss
 * 
 * @param danger - Base danger level
 * @param floor - Current floor
 * @returns Modified danger level (reduced if floor 1)
 */
export function applyFirstBossScaling(danger: number, floor: number): number {
    const config = GAME_CONFIG.combat.turnBased.firstBossScaling

    if (!config.enabled || floor > config.floorThreshold) {
        return danger
    }

    return danger * (1 - config.dangerReduction)
}
