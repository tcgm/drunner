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
            return (defense * factor) / (1 + defense * factor)

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
