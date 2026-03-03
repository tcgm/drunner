/**
 * Defense calculation utilities
 * 
 * Uses the curve-based system from defenseConfig.ts
 * The curve automatically scales based on theoretical max defense
 */

import { calculateBlockPercent, formatBlockPercent } from '@/config/defenseConfig'

/**
 * Calculate damage reduction percentage based on defense value
 * 
 * This now uses the curve system from defenseConfig.ts which:
 * - Automatically scales to theoretical max defense
 * - Supports multiple curve types (linear, diminishing, logarithmic, exponential)
 * - Is easily tunable without changing formulas
 * 
 * @param defense - Current defense stat
 * @returns Block percentage (0.0 to maxBlockPercent, default 0.95)
 */
export function calculateDefenseReduction(defense: number): number {
    return calculateBlockPercent(defense)
}

/**
 * Format defense reduction as a percentage string
 * 
 * @param defense - Current defense stat
 * @returns Formatted string like "42.5%"
 */
export function formatDefenseReduction(defense: number): string {
    return `(${formatBlockPercent(defense)})`
}

/**
 * Apply defense to reduce incoming damage
 * Uses the curve-based percentage reduction system
 * 
 * @param incomingDamage - Damage before defense
 * @param defense - Defense stat value
 * @returns Damage after defense reduction (minimum 1)
 */
export function applyDefenseReduction(incomingDamage: number, defense: number): number {
    const reductionPercent = calculateDefenseReduction(defense)
    const reducedDamage = incomingDamage * (1 - reductionPercent)
    return Math.max(1, Math.floor(reducedDamage))
}
