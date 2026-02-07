/**
 * Item Converter - V2 to V3 Migration
 * Converts legacy V2 items to new V3 format with session tracking
 */

import type { ItemV2, ItemV3, ProceduralItemV3, ConsumableV3, UniqueItemV3, SetItemV3 } from '@/types/items-v3'
import type { Item, Consumable } from '@/types'
import { parseProceduralName, parseConsumableName, parseLegacyConsumableName } from './itemNameParser'
import { ALL_UNIQUE_ITEMS } from '@/data/items/uniques'
import { ALL_SET_ITEMS, getSetIdFromItemName } from '@/data/items/sets'

/**
 * Session tracking for conversion attempts
 * Prevents redundant conversion attempts within same session
 */
const convertedItemIds = new Set<string>()
const failedItemIds = new Set<string>()

/**
 * Mark an item as converted (successful)
 */
export function markConverted(itemId: string): void {
    convertedItemIds.add(itemId)
}

/**
 * Mark an item as failed conversion
 */
export function markConversionFailed(itemId: string): void {
    failedItemIds.add(itemId)
}

/**
 * Check if item was already converted this session
 */
export function wasConverted(itemId: string): boolean {
    return convertedItemIds.has(itemId)
}

/**
 * Check if item conversion failed this session
 */
export function conversionFailed(itemId: string): boolean {
    return failedItemIds.has(itemId)
}

/**
 * Check if item was already attempted (succeeded or failed)
 */
export function wasAttempted(itemId: string): boolean {
    return convertedItemIds.has(itemId) || failedItemIds.has(itemId)
}

/**
 * Clear session tracking (useful for testing or manual refresh)
 */
export function clearConversionTracking(): void {
    convertedItemIds.clear()
    failedItemIds.clear()
}

/**
 * Get conversion statistics
 */
export function getConversionStats(): {
    converted: number
    failed: number
    total: number
} {
    return {
        converted: convertedItemIds.size,
        failed: failedItemIds.size,
        total: convertedItemIds.size + failedItemIds.size
    }
}

/**
 * Convert V2 item to V3 format
 * Returns null if conversion fails (unparseable)
 */
export function convertToV3(itemV2: ItemV2): ItemV3 | null {
    // Check if already converted or failed
    if (wasAttempted(itemV2.id)) {
        return null
    }

    try {
        // Check if it's a unique item
        if (itemV2.isUnique && !itemV2.setId) {
            return convertUniqueToV3(itemV2)
        }

        // Check if it's a set item
        if (itemV2.setId) {
            return convertSetToV3(itemV2)
        }

        // Check if it's a consumable
        if (itemV2.type === 'consumable') {
            return convertConsumableToV3(itemV2 as unknown as Consumable)
        }

        // Otherwise, it's a procedural item
        return convertProceduralToV3(itemV2)
    } catch (error) {
        console.error(`Failed to convert item ${itemV2.id} (${itemV2.name}):`, error)
        markConversionFailed(itemV2.id)
        return null
    }
}

/**
 * Convert procedural item to V3
 */
function convertProceduralToV3(item: ItemV2): ProceduralItemV3 | null {
    // Parse name to extract material, base, and variant
    const parsed = parseProceduralName(item.name, item.type)

    if (!parsed) {
        markConversionFailed(item.id)
        return null
    }

    const v3Item: ProceduralItemV3 = {
        version: 3,
        id: item.id,
        itemType: 'procedural',
        type: item.type as 'weapon' | 'armor' | 'helmet' | 'boots' | 'accessory',
        materialId: parsed.materialId,
        baseTemplateId: parsed.baseTemplateId,
        variantName: parsed.variantName,
        rarity: item.rarity,
        modifiers: item.modifiers
    }

    markConverted(item.id)
    return v3Item
}

/**
 * Convert consumable to V3
 */
function convertConsumableToV3(item: Consumable): ConsumableV3 | null {
    // If item already has metadata, use it
    if (item.baseId && item.sizeId && item.potencyId) {
        const v3Item: ConsumableV3 = {
            version: 3,
            id: item.id,
            itemType: 'consumable',
            baseId: item.baseId,
            sizeId: item.sizeId,
            potencyId: item.potencyId,
            rarity: item.rarity,
            stackCount: item.stackCount
        }

        markConverted(item.id)
        return v3Item
    }

    // Try to parse name
    let parsed = parseConsumableName(item.name)

    // If standard parse fails, try legacy format
    if (!parsed) {
        const legacyParsed = parseLegacyConsumableName(item.name)
        if (legacyParsed) {
            const v3Item: ConsumableV3 = {
                version: 3,
                id: item.id,
                itemType: 'consumable',
                baseId: legacyParsed.baseId,
                sizeId: legacyParsed.sizeId,
                potencyId: legacyParsed.potencyId,
                rarity: item.rarity,
                stackCount: item.stackCount || 1
            }

            markConverted(item.id)
            return v3Item
        }

        markConversionFailed(item.id)
        return null
    }

    const v3Item: ConsumableV3 = {
        version: 3,
        id: item.id,
        itemType: 'consumable',
        baseId: parsed.baseId,
        sizeId: parsed.sizeId,
        potencyId: parsed.potencyId,
        rarity: item.rarity,
        stackCount: item.stackCount || 1
    }

    markConverted(item.id)
    return v3Item
}

/**
 * Convert unique item to V3
 */
function convertUniqueToV3(item: ItemV2): UniqueItemV3 | null {
    // Try to find matching unique template
    const templateId = item.name.toUpperCase().replace(/['\s]/g, '_')

    const template = ALL_UNIQUE_ITEMS.find(t => {
        const constantName = t.name.toUpperCase().replace(/['\s]/g, '_')
        return templateId === constantName || item.name === t.name
    })

    if (!template) {
        markConversionFailed(item.id)
        return null
    }

    const v3Item: UniqueItemV3 = {
        version: 3,
        id: item.id,
        itemType: 'unique',
        templateId,
        modifiers: item.modifiers
    }

    markConverted(item.id)
    return v3Item
}

/**
 * Convert set item to V3
 */
function convertSetToV3(item: ItemV2): SetItemV3 | null {
    if (!item.setId) {
        markConversionFailed(item.id)
        return null
    }

    // Try to find matching set template
    const setId = getSetIdFromItemName(item.name)
    const template = ALL_SET_ITEMS.find(t => {
        const constantName = t.name.toUpperCase().replace(/['\s]/g, '_')
        return setId === constantName || item.setId === constantName
    })

    if (!template) {
        markConversionFailed(item.id)
        return null
    }

    const templateId = template.name.toUpperCase().replace(/['\s]/g, '_')

    // Check if it was rolled as unique (boosted stats)
    // This is difficult to detect perfectly, but we can try:
    // - If stats are significantly higher than base template
    // - Or if rarity is legendary/mythic
    const isUniqueRoll = item.rarity === 'legendary' || item.rarity === 'mythic'

    const v3Item: SetItemV3 = {
        version: 3,
        id: item.id,
        itemType: 'set',
        templateId,
        isUniqueRoll,
        modifiers: item.modifiers
    }

    markConverted(item.id)
    return v3Item
}
