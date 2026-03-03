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
 * Apply early boss scaling reduction with tapering from floors 1-10
 * 
 * @param danger - Base danger level
 * @param floor - Current floor
 * @returns Modified danger level (reduced for early floors with linear taper)
 * 
 * @example
 * // Floor 1: 60% reduction
 * applyEarlyBossScaling(10, 1) // 10 * (1 - 0.60) = 4.0
 * 
 * // Floor 5: 36% reduction (60% - 4*6%)
 * applyEarlyBossScaling(10, 5) // 10 * (1 - 0.36) = 6.4
 * 
 * // Floor 10: 6% reduction (60% - 9*6%)
 * applyEarlyBossScaling(10, 10) // 10 * (1 - 0.06) = 9.4
 * 
 * // Floor 11+: No reduction
 * applyEarlyBossScaling(10, 11) // 10.0
 */
export function applyEarlyBossScaling(danger: number, floor: number): number {
    const config = GAME_CONFIG.combat.turnBased.earlyBossScaling

    if (!config.enabled || floor > config.maxFloor) {
        return danger
    }

    // Calculate reduction: baseReduction - (floor - 1) * taperPerFloor
    // Floor 1: 0.60 - 0 * 0.06 = 0.60
    // Floor 5: 0.60 - 4 * 0.06 = 0.36
    // Floor 10: 0.60 - 9 * 0.06 = 0.06
    const reduction = Math.max(0, config.baseReduction - (floor - 1) * config.taperPerFloor)

    return danger * (1 - reduction)
}

// Legacy alias for backward compatibility
export const applyFirstBossScaling = applyEarlyBossScaling
