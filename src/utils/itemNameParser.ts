/**
 * Item Name Parser
 * Extracts material, base, and variant information from V2 item names
 * Used for automatic V2→V3 migration
 */

import { ALL_MATERIALS } from '@/data/items/materials'
import { allBases } from '@/data/items/bases'
import { ALL_SIZES } from '@/data/consumables/sizes'
import { ALL_POTENCIES } from '@/data/consumables/potencies'
import { ALL_CONSUMABLE_BASES } from '@/data/consumables/bases'
import type { ItemSlot } from '@/types'

/**
 * Parse procedural item name to extract IDs
 * Format: "{Material} {Variant}" (e.g., "Mithril Blade", "Iron Staff")
 */
export function parseProceduralName(name: string, type: ItemSlot): {
    materialId: string
    baseTemplateId: string
    variantName: string
} | null {
    if (!name || typeof name !== 'string') {
        return null
    }

    // Try to match material prefix
    let matchedMaterial: typeof ALL_MATERIALS[0] | null = null
    let remainingName = name

    for (const material of ALL_MATERIALS) {
        if (name.startsWith(material.prefix)) {
            matchedMaterial = material
            remainingName = name.substring(material.prefix.length).trim()
            break
        }
    }

    if (!matchedMaterial || !remainingName) {
        return null
    }

    // Remaining name should be the variant (e.g., "Blade", "Staff", "Crown")
    const variantName = remainingName

    // Search all base templates for one that:
    // 1. Has this variant in its baseNames array
    // 2. Matches the item type (or is compatible)
    const matchingBase = allBases.find(base => {
        // Type must match (or be compatible - accessories can have multiple slot types)
        const typeMatches = base.type === type ||
            (type.startsWith('accessory') && base.type.startsWith('accessory'))

        if (!typeMatches) {
            return false
        }

        // Check if variant matches any baseName (case-insensitive)
        if (base.baseNames && base.baseNames.length > 0) {
            return base.baseNames.some(
                baseName => baseName.toLowerCase() === variantName.toLowerCase()
            )
        }

        return false
    })

    if (!matchingBase) {
        return null
    }

    // Construct baseTemplateId in new dot format
    const baseTemplateId = `${matchingBase.type}.${matchingBase.id}`

    // Find exact variant match (preserve case from template)
    const exactVariant = matchingBase.baseNames?.find(
        bn => bn.toLowerCase() === variantName.toLowerCase()
    ) || variantName

    return {
        materialId: matchedMaterial.id,
        baseTemplateId,
        variantName: exactVariant
    }
}

/**
 * Parse consumable name to extract IDs
 * Format: "{Potency} {Size} {Base} Potion" (e.g., "Potent Large Health Potion")
 */
export function parseConsumableName(name: string): {
    baseId: string
    sizeId: string
    potencyId: string
} | null {
    if (!name || typeof name !== 'string') {
        return null
    }

    let remainingName = name.toLowerCase()
    let matchedPotency: typeof ALL_POTENCIES[0] | null = null
    let matchedSize: typeof ALL_SIZES[0] | null = null
    let matchedBase: typeof ALL_CONSUMABLE_BASES[0] | null = null

    // Try to match potency prefix (e.g., "Potent", "Weak")
    for (const potency of ALL_POTENCIES) {
        const prefix = potency.prefix.toLowerCase()
        if (prefix && remainingName.startsWith(prefix)) {
            matchedPotency = potency
            remainingName = remainingName.substring(prefix.length).trim()
            break
        }
    }

    // Default to "normal" potency if none matched
    if (!matchedPotency) {
        matchedPotency = ALL_POTENCIES.find(p => p.id === 'normal') || ALL_POTENCIES[0]
    }

    // Try to match size prefix (e.g., "Large", "Small")
    for (const size of ALL_SIZES) {
        const prefix = size.prefix.toLowerCase()
        if (remainingName.startsWith(prefix)) {
            matchedSize = size
            remainingName = remainingName.substring(prefix.length).trim()
            break
        }
    }

    if (!matchedSize) {
        return null // Size is required
    }

    // Remove "potion" suffix if present
    remainingName = remainingName.replace(/\s*potion\s*$/, '').trim()

    // Try to match base name
    for (const base of ALL_CONSUMABLE_BASES) {
        const baseName = base.name.toLowerCase()
        if (remainingName === baseName || remainingName.startsWith(baseName)) {
            matchedBase = base
            break
        }
    }

    if (!matchedBase) {
        return null
    }

    return {
        baseId: matchedBase.id,
        sizeId: matchedSize.id,
        potencyId: matchedPotency.id
    }
}

/**
 * Parse legacy consumable names to map them to V3 format
 * Maps hardcoded names like "Small Health Potion" to procedural IDs
 */
export function parseLegacyConsumableName(name: string): {
    baseId: string
    sizeId: string
    potencyId: string
    rarity: string
} | null {
    if (!name || typeof name !== 'string') {
        return null
    }

    const lowerName = name.toLowerCase()

    // Legacy health potions
    if (lowerName === 'small health potion') {
        return { baseId: 'health', sizeId: 'small', potencyId: 'normal', rarity: 'common' }
    }
    if (lowerName === 'medium health potion') {
        return { baseId: 'health', sizeId: 'medium', potencyId: 'normal', rarity: 'common' }
    }
    if (lowerName === 'large health potion') {
        return { baseId: 'health', sizeId: 'large', potencyId: 'normal', rarity: 'uncommon' }
    }
    if (lowerName === 'greater health potion') {
        return { baseId: 'health', sizeId: 'large', potencyId: 'potent', rarity: 'rare' }
    }

    // Try standard parsing as fallback
    const parsed = parseConsumableName(name)
    if (parsed) {
        return { ...parsed, rarity: 'common' }
    }

    return null
}
