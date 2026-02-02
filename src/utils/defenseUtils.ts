/**
 * Defense calculation utilities
 */

import { GAME_CONFIG } from '@/config/gameConfig'

/**
 * Calculate damage reduction percentage based on defense value and current formula
 */
export function calculateDefenseReduction(defense: number): number {
    const formula = GAME_CONFIG.combat.defenseFormula

    switch (formula) {
        case 'flat':
            // Flat reduction doesn't have a percentage - return 0
            return 0

        case 'percentage':
            return defense / (defense + GAME_CONFIG.combat.percentageBase)

        case 'logarithmic':
            const factor = GAME_CONFIG.combat.logFactor
            const uncapped = (defense * factor) / (1 + defense * factor)
            return Math.min(uncapped, GAME_CONFIG.combat.maxLogReduction)

        case 'hybrid':
            return Math.min(
                GAME_CONFIG.combat.maxReduction,
                defense / (defense + GAME_CONFIG.combat.hybridBase)
            )

        default:
            return 0
    }
}

/**
 * Format defense reduction as a percentage string
 */
export function formatDefenseReduction(defense: number): string {
    const formula = GAME_CONFIG.combat.defenseFormula

    if (formula === 'flat') {
        // For flat formula, show flat reduction value instead
        return `(-${Math.floor(defense * GAME_CONFIG.combat.defenseReduction)})`
    }

    const reduction = calculateDefenseReduction(defense)
    return `(${(reduction * 100).toFixed(1)}%)`
}

/**
 * Apply defense to reduce incoming damage
 */
export function applyDefenseReduction(incomingDamage: number, defense: number): number {
    const formula = GAME_CONFIG.combat.defenseFormula

    switch (formula) {
        case 'flat':
            // Flat reduction: subtract defense * factor
            return Math.max(1, incomingDamage - Math.floor(defense * GAME_CONFIG.combat.defenseReduction))

        case 'percentage':
        case 'logarithmic':
        case 'hybrid': {
            // All percentage-based formulas: reduce by percentage
            const reductionPercent = calculateDefenseReduction(defense)
            const reducedDamage = incomingDamage * (1 - reductionPercent)
            return Math.max(1, Math.floor(reducedDamage))
        }

        default:
            return Math.max(1, incomingDamage)
    }
}
