/**
 * Item Stat Calculation
 * Centralized stat calculation for all item types
 * Stats are NEVER stored on items, only derived at hydration time
 */

import type { Stats, ItemRarity } from '@/types'
import type { Material } from '@/data/items/materials'
import type { BaseItemTemplate } from '@/data/items/bases'
import { getRarityConfig } from '@/systems/rarity/raritySystem'
import { getModifierById, type ItemModifier } from '@/data/items/mods'

/**
 * Calculate stats for procedural items
 * Formula: base × material × rarity × modifiers
 */
export function calculateProceduralStats(
    baseTemplate: BaseItemTemplate,
    material: Material,
    rarity: ItemRarity,
    modifierIds?: string[]
): Partial<Stats> {
    const rarityConfig = getRarityConfig(rarity)
    const rarityMultiplier = rarityConfig.statMultiplierBase
    const materialMultiplier = material.statMultiplier

    // Calculate base stats: base × material × rarity
    const stats: Partial<Stats> = {}
    for (const [key, baseValue] of Object.entries(baseTemplate.stats)) {
        if (typeof baseValue === 'number') {
            stats[key as keyof Stats] = Math.floor(baseValue * materialMultiplier * rarityMultiplier)
        }
    }

    // Apply modifiers if present
    if (modifierIds && modifierIds.length > 0) {
        applyModifierStats(stats, modifierIds)
    }

    return stats
}

/**
 * Calculate stats for unique items
 * Formula: template stats × rarity multiplier × unique boost (30%) × modifiers
 */
export function calculateUniqueStats(
    baseStats: Partial<Stats>,
    templateRarity: ItemRarity,
    actualRarity?: ItemRarity,
    modifierIds?: string[]
): Partial<Stats> {
    const UNIQUE_BOOST = 1.3 // 30% boost for unique items

    // Use actualRarity if provided, otherwise use template rarity
    const effectiveRarity = actualRarity || templateRarity
    const rarityConfig = getRarityConfig(effectiveRarity)
    const rarityMultiplier = rarityConfig.statMultiplierBase

    const stats: Partial<Stats> = {}
    for (const [key, value] of Object.entries(baseStats)) {
        if (typeof value === 'number') {
            stats[key as keyof Stats] = Math.floor(value * rarityMultiplier * UNIQUE_BOOST)
        }
    }

    // Apply modifiers if present
    if (modifierIds && modifierIds.length > 0) {
        applyModifierStats(stats, modifierIds)
    }

    return stats
}

/**
 * Calculate stats for set items
 * Formula: template stats × rarity multiplier × [unique boost if rolled as unique] × modifiers
 */
export function calculateSetStats(
    baseStats: Partial<Stats>,
    templateRarity: ItemRarity,
    actualRarity: ItemRarity | undefined,
    isUniqueRoll: boolean,
    modifierIds?: string[]
): Partial<Stats> {
    const UNIQUE_BOOST = 1.3 // 30% boost if rolled as unique

    // Use actualRarity if provided, otherwise use template rarity
    const effectiveRarity = actualRarity || templateRarity
    const rarityConfig = getRarityConfig(effectiveRarity)
    const rarityMultiplier = rarityConfig.statMultiplierBase

    const stats: Partial<Stats> = {}
    for (const [key, value] of Object.entries(baseStats)) {
        if (typeof value === 'number') {
            const boostedValue = isUniqueRoll ? value * rarityMultiplier * UNIQUE_BOOST : value * rarityMultiplier
            stats[key as keyof Stats] = Math.floor(boostedValue)
        }
    }

    // Apply modifiers if present
    if (modifierIds && modifierIds.length > 0) {
        applyModifierStats(stats, modifierIds)
    }

    return stats
}

/**
 * Calculate stats for consumables (effect values)
 * Formula: base × size × potency × rarity
 */
export function calculateConsumableEffectValues(
    baseValue: number,
    sizeMultiplier: number,
    potencyMultiplier: number,
    rarity: ItemRarity
): number {
    const rarityConfig = getRarityConfig(rarity)
    const rarityMultiplier = rarityConfig.statMultiplierBase

    return Math.floor(baseValue * sizeMultiplier * potencyMultiplier * rarityMultiplier)
}

/**
 * Apply modifier stat multipliers to item stats
 * Modifiers are looked up from template registry by ID
 */
function applyModifierStats(stats: Partial<Stats>, modifierIds: string[]): void {
    for (const modId of modifierIds) {
        const modifier = getModifierById(modId)
        if (!modifier || !modifier.statMultipliers) {
            continue
        }

        // Apply each stat multiplier
        for (const [statKey, multiplier] of Object.entries(modifier.statMultipliers)) {
            const key = statKey as keyof Stats
            const currentValue = stats[key]

            if (typeof currentValue === 'number' && typeof multiplier === 'number') {
                // Multiplier approach: multiply current value
                stats[key] = Math.floor(currentValue * multiplier)
            } else if (typeof multiplier === 'number') {
                // Additive approach: add flat value (some modifiers may use this)
                stats[key] = (stats[key] || 0) + Math.floor(multiplier)
            }
        }
    }
}

/**
 * Calculate item value
 * Formula: base value × material × rarity × modifiers
 */
export function calculateItemValue(
    baseValue: number,
    material: Material,
    rarity: ItemRarity,
    modifierIds?: string[]
): number {
    const rarityConfig = getRarityConfig(rarity)
    const rarityMultiplier = rarityConfig.statMultiplierBase

    let value = Math.floor(baseValue * material.valueMultiplier * rarityMultiplier)

    // Apply modifier value multipliers
    if (modifierIds && modifierIds.length > 0) {
        for (const modId of modifierIds) {
            const modifier = getModifierById(modId)
            if (modifier && modifier.valueMultiplier) {
                value = Math.floor(value * modifier.valueMultiplier)
            }
        }
    }

    return value
}

/**
 * Calculate consumable value
 * Formula: base gold value × size × potency × rarity
 */
export function calculateConsumableValue(
    baseGoldValue: number,
    sizeMultiplier: number,
    potencyMultiplier: number,
    rarity: ItemRarity
): number {
    const rarityConfig = getRarityConfig(rarity)
    const rarityMultiplier = rarityConfig.statMultiplierBase

    return Math.floor(baseGoldValue * sizeMultiplier * potencyMultiplier * rarityMultiplier)
}
