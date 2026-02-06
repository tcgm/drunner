import type { Item, Consumable } from '@/types'

/**
 * Detects and collapses duplicate item IDs in an inventory array
 * For stackable consumables, increases stack count
 * For non-stackable items, keeps only the first occurrence
 */
export function deduplicateItems(items: (Item | null)[]): Item[] {
    const seen = new Map<string, Item>()
    const deduplicated: Item[] = []

    for (const item of items) {
        if (!item) continue

        const existingItem = seen.get(item.id)

        if (existingItem) {
            // Duplicate found
            console.warn(`[Deduplication] Found duplicate item ID: ${item.id} (${item.name})`)

            // If it's a stackable consumable, increase stack count
            if ('consumableType' in item && 'stackable' in item && item.stackable &&
                'consumableType' in existingItem && 'stackable' in existingItem && existingItem.stackable) {
                const consumable = existingItem as Consumable
                const duplicateConsumable = item as Consumable
                consumable.stackCount = (consumable.stackCount || 1) + (duplicateConsumable.stackCount || 1)
                console.log(`[Deduplication] Increased stack count to ${consumable.stackCount} for ${item.name}`)
            } else {
                // For non-stackable items, just skip the duplicate
                console.log(`[Deduplication] Skipping duplicate non-stackable item: ${item.name}`)
            }
        } else {
            // First occurrence of this ID
            seen.set(item.id, item)
            deduplicated.push(item)
        }
    }

    return deduplicated
}

/**
 * Deduplicates items in all hero slots
 * Returns a map of hero ID to deduplicated slot items and an array of recovered items
 */
export function deduplicateHeroSlots(
    heroes: Array<{ id: string; slots: Record<string, Item | null> }>,
    globalSeenIds: Set<string>
): { deduplicatedSlots: Map<string, Record<string, Item | null>>; recoveredItems: Item[] } {
    const deduplicatedSlots = new Map<string, Record<string, Item | null>>()
    const recoveredItems: Item[] = []

    for (const hero of heroes) {
        const newSlots: Record<string, Item | null> = {}

        for (const [slotId, item] of Object.entries(hero.slots)) {
            if (!item) {
                newSlots[slotId] = null
                continue
            }

            if (globalSeenIds.has(item.id)) {
                console.warn(`[Deduplication] Found duplicate item in hero ${hero.id} slot ${slotId}: ${item.id} (${item.name}) - moving to bank`)
                newSlots[slotId] = null // Clear the duplicate slot
                recoveredItems.push(item) // Recover the item to bank
            } else {
                globalSeenIds.add(item.id)
                newSlots[slotId] = item
            }
        }

        deduplicatedSlots.set(hero.id, newSlots)
    }

    return { deduplicatedSlots, recoveredItems }
}

/**
 * Comprehensive deduplication report
 */
export interface DeduplicationReport {
    totalDuplicatesFound: number
    bankDuplicates: number
    dungeonDuplicates: number
    heroDuplicates: number
    itemsRemoved: string[] // Item names that were removed
}

/**
 * Deduplicates all items in the game state and returns a report
 */
export function deduplicateGameState(state: {
    bankInventory: Item[]
    dungeon: { inventory: Item[] }
    party: Array<{ id: string; slots: Record<string, Item | null> } | null>
    heroRoster: Array<{ id: string; slots: Record<string, Item | null> }>
}): DeduplicationReport {
    const report: DeduplicationReport = {
        totalDuplicatesFound: 0,
        bankDuplicates: 0,
        dungeonDuplicates: 0,
        heroDuplicates: 0,
        itemsRemoved: []
    }

    // Track all seen item IDs globally across all inventories
    const globalSeenIds = new Set<string>()
    const itemsToRecoverToBank: Item[] = []

    // FIRST PRIORITY: Collect all hero-equipped items (these are kept)
    // Deduplicate heroes themselves first (roster contains all heroes including party members)
    const seenHeroIds = new Set<string>()
    const allHeroes = [
        ...state.party.filter((h): h is NonNullable<typeof h> => h !== null),
        ...state.heroRoster
    ].filter(hero => {
        if (seenHeroIds.has(hero.id)) {
            return false // Skip duplicate hero entry
        }
        seenHeroIds.add(hero.id)
        return true
    })

    // Deduplicate within hero slots first (keep first occurrence on heroes)
    const { deduplicatedSlots, recoveredItems } = deduplicateHeroSlots(allHeroes, globalSeenIds)
    itemsToRecoverToBank.push(...recoveredItems)

    // Track all hero-equipped item IDs
    allHeroes.forEach(hero => {
        const slots = deduplicatedSlots.get(hero.id)
        if (slots) {
            Object.values(slots).forEach(item => {
                if (item) globalSeenIds.add(item.id)
            })
        }
    })

    // SECOND PRIORITY: Deduplicate bank inventory, removing any that match hero items
    const originalBankSize = state.bankInventory.length
    state.bankInventory = state.bankInventory.filter(item => {
        if (globalSeenIds.has(item.id)) {
            console.log(`[Deduplication] Removing bank item ${item.id} (${item.name}) - already equipped on hero`)
            return false
        }
        globalSeenIds.add(item.id)
        return true
    })

    // Also deduplicate within bank itself
    state.bankInventory = deduplicateItems(state.bankInventory)
    report.bankDuplicates = originalBankSize - state.bankInventory.length

    // THIRD PRIORITY: Deduplicate dungeon inventory
    const originalDungeonSize = state.dungeon.inventory.length
    state.dungeon.inventory = state.dungeon.inventory.filter(item => {
        if (globalSeenIds.has(item.id)) {
            console.log(`[Deduplication] Removing dungeon item ${item.id} (${item.name}) - already exists elsewhere`)
            return false
        }
        globalSeenIds.add(item.id)
        return true
    })

    // Also deduplicate within dungeon itself
    state.dungeon.inventory = deduplicateItems(state.dungeon.inventory)
    report.dungeonDuplicates = originalDungeonSize - state.dungeon.inventory.length

    // Add recovered items from hero slot duplicates back to bank
    if (itemsToRecoverToBank.length > 0) {
        console.log(`[Deduplication] Recovering ${itemsToRecoverToBank.length} items from duplicate hero slots to bank`)
        state.bankInventory.push(...itemsToRecoverToBank)
        report.heroDuplicates = itemsToRecoverToBank.length
    }

    // Apply deduplicated slots back to party
    state.party = state.party.map(hero => {
        if (!hero) return null
        const newSlots = deduplicatedSlots.get(hero.id)
        if (newSlots) {
            return { ...hero, slots: newSlots }
        }
        return hero
    })

    // Apply deduplicated slots back to roster
    state.heroRoster = state.heroRoster.map(hero => {
        const newSlots = deduplicatedSlots.get(hero.id)
        if (newSlots) {
            return { ...hero, slots: newSlots }
        }
        return hero
    })

    report.totalDuplicatesFound = report.bankDuplicates + report.dungeonDuplicates + report.heroDuplicates

    if (report.totalDuplicatesFound > 0) {
        console.warn(`[Deduplication] Found ${report.totalDuplicatesFound} duplicate items:`, {
            bank: report.bankDuplicates,
            dungeon: report.dungeonDuplicates,
            heroes: report.heroDuplicates,
            recovered: itemsToRecoverToBank.length
        })
    }

    return report
}
