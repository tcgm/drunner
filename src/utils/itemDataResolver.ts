import type { Item, Consumable, ConsumableEffect } from '@/types'
import { getConsumableBaseById } from '@/data/consumables/bases'
import { getSizeById } from '@/data/consumables/sizes'
import { getPotencyById } from '@/data/consumables/potencies'
import { getRarityConfig } from '@/systems/rarity/raritySystem'

/**
 * Resolves missing or corrupted data for consumables using their metadata
 * Reconstructs effects from baseId, sizeId, potencyId, and rarity
 */
function resolveConsumableData(consumable: Consumable): boolean {
    // If effects already exist and are valid, no need to resolve
    if (consumable.effects && Array.isArray(consumable.effects) && consumable.effects.length > 0) {
        return false // No changes made
    }

    // Try to reconstruct from metadata
    if (!consumable.baseId || !consumable.sizeId || !consumable.potencyId) {
        console.warn('[ItemDataResolver] Consumable missing metadata:', consumable.name, consumable.id)
        return false
    }

    const base = getConsumableBaseById(consumable.baseId)
    const size = getSizeById(consumable.sizeId)
    const potency = getPotencyById(consumable.potencyId)

    if (!base || !size || !potency) {
        console.warn('[ItemDataResolver] Could not resolve consumable metadata:', {
            name: consumable.name,
            id: consumable.id,
            baseId: consumable.baseId,
            sizeId: consumable.sizeId,
            potencyId: consumable.potencyId,
        })
        return false
    }

    const rarityConfig = getRarityConfig(consumable.rarity)
    const rarityMultiplier = rarityConfig.statMultiplierBase

    // Reconstruct effects with scaling
    const scaledEffects: ConsumableEffect[] = base.effects.map(effect => ({
        type: effect.type,
        value: effect.value ? Math.floor(effect.value * size.multiplier * potency.multiplier * rarityMultiplier) : undefined,
        stat: effect.stat,
        duration: effect.duration,
        target: effect.target,
        isPermanent: false,
    }))

    // Update the consumable object in place
    consumable.effects = scaledEffects

    console.log('[ItemDataResolver] Resolved consumable effects:', consumable.name, scaledEffects)
    return true // Changes made
}

/**
 * Resolves missing or corrupted data for any item type
 * Returns true if item data was modified, false otherwise
 */
export function resolveItemData(item: Item): boolean {
    if (!item) return false

    // Handle consumables
    if ('consumableType' in item) {
        return resolveConsumableData(item as Consumable)
    }

    // Add other item type resolution here in the future
    // For example: resolve equipment stats, resolve unique effects, etc.

    return false
}

/**
 * Resolves data for multiple items at once
 * Returns the count of items that were modified
 */
export function resolveItemDataBatch(items: (Item | null)[]): number {
    let modifiedCount = 0

    for (const item of items) {
        if (item && resolveItemData(item)) {
            modifiedCount++
        }
    }

    return modifiedCount
}

/**
 * Ensures consumable has valid effects, resolving if needed
 * Returns the effects array (either existing or newly resolved)
 */
export function getConsumableEffects(consumable: Consumable): ConsumableEffect[] {
    resolveItemData(consumable)
    return consumable.effects || []
}
