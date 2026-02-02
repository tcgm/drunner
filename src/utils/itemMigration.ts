import type { Item, Hero } from '@/types'
import { getMaterialById } from '@/data/items/materials'
import { getCompatibleBase } from '@/data/items/bases'
import { getRarityConfig } from '@/systems/rarity/raritySystem'
import { ALL_SET_ITEMS } from '@/data/items/sets'

/**
 * Current stat calculation version
 * Increment this when the stat formula changes
 */
export const CURRENT_STAT_VERSION = 1

// Track logged migrations to avoid spam
const loggedSetFixes = new Set<string>()
const loggedStatMigrations = new Set<string>()

/**
 * Generate what an item's stats SHOULD be with the current formula
 * This creates a phantom copy to compare against
 */
function generateExpectedStats(item: Item): { stats: typeof item.stats; value: number } | null {
  // Handle set items separately
  if (item.setId) {
    const setTemplate = ALL_SET_ITEMS.find(s => s.name === item.name)
    if (setTemplate) {
      const rarityConfig = getRarityConfig(setTemplate.rarity)
      const rarityMultiplier = rarityConfig.statMultiplierBase

      // Apply rarity multiplier to template stats
      const expectedStats: typeof item.stats = {}
      for (const [key, baseValue] of Object.entries(setTemplate.stats)) {
        if (baseValue !== undefined && typeof baseValue === 'number') {
          expectedStats[key as keyof typeof item.stats] = Math.floor(baseValue * rarityMultiplier)
        }
      }

      // If the item is marked as unique, apply additional boost
      const uniqueBoost = item.isUnique ? 1.3 : 1.0
      if (item.isUnique) {
        for (const [key, value] of Object.entries(expectedStats)) {
          if (value !== undefined && typeof value === 'number') {
            expectedStats[key as keyof typeof item.stats] = Math.floor(value * uniqueBoost)
          }
        }
      }

      const expectedValue = item.isUnique
        ? Math.floor(setTemplate.value * rarityMultiplier * uniqueBoost)
        : Math.floor(setTemplate.value * rarityMultiplier)

      return { stats: expectedStats, value: expectedValue }
    }
  }

  // Skip unique items (they have fixed stats) and items without material metadata
  if (item.isUnique || !item.materialId) {
    return null
  }
  
  // Get material and rarity multipliers
  const material = getMaterialById(item.materialId)
  if (!material) {
    console.warn(`Cannot calculate expected stats for ${item.name}: material ${item.materialId} not found`)
    return null
  }
  
  // Try to find the base template
  const baseTemplate = item.baseTemplateId ? getCompatibleBase(item.type, item.materialId) : null
  if (!baseTemplate) {
    console.warn(`Cannot calculate expected stats for ${item.name}: base template not found`)
    return null
  }
  
  const rarityConfig = getRarityConfig(item.rarity)
  const rarityMultiplier = rarityConfig.statMultiplierBase
  const materialMultiplier = material.statMultiplier
  
  // Calculate expected stats: base × material × rarity
  const expectedStats: typeof item.stats = {}
  for (const [key, baseValue] of Object.entries(baseTemplate.stats)) {
    if (baseValue !== undefined && typeof baseValue === 'number') {
      expectedStats[key as keyof typeof item.stats] = Math.floor(baseValue * materialMultiplier * rarityMultiplier)
    }
  }
  
  // Calculate expected value
  const baseValue = 50 // From lootGenerator.ts
  const expectedValue = Math.floor(baseValue * material.valueMultiplier * rarityMultiplier)
  
  return { stats: expectedStats, value: expectedValue }
}

/**
 * Check if an item's stats match what they should be with current formula
 */
function itemStatsAreCorrect(item: Item, expected: { stats: typeof item.stats; value: number }): boolean {
  // Compare each stat
  for (const [key, expectedValue] of Object.entries(expected.stats)) {
    const actualValue = item.stats[key as keyof typeof item.stats]
    if (actualValue !== expectedValue) {
      return false
    }
  }
  
  // Compare value
  if (item.value !== expected.value) {
    return false
  }
  
  return true
}

/**
 * Migrate an item to current stat calculation version
 * Uses versioning to avoid double-migration
 */
export function migrateItemStats(item: Item): Item {
  // Check if this is a set item by name match
  const setTemplate = ALL_SET_ITEMS.find(s => s.name === item.name)
  if (setTemplate && !item.setId) {
    if (!loggedSetFixes.has(item.name)) {
      console.log(`Detected set item ${item.name} without setId, adding it`)
      loggedSetFixes.add(item.name)
    }
    item = {
      ...item,
      rarity: setTemplate.rarity,
      setId: 'kitsune', // Ensure setId is set
    }
  }

  // Fix old saves where set items had rarity: 'set'
  // @ts-expect-error - Old saves may have invalid 'set' rarity
  if (item.rarity === 'set') {
    if (setTemplate) {
      if (!loggedSetFixes.has(item.name)) {
        console.log(`Fixing set item ${item.name} rarity from 'set' to '${setTemplate.rarity}'`)
        loggedSetFixes.add(item.name)
      }
      item = {
        ...item,
        rarity: setTemplate.rarity,
        setId: 'kitsune', // Ensure setId is set
      }
    }
  }
  
  // Skip consumables
  if ('consumableType' in item) {
    return item
  }
  
  // If already at current version, skip
  if (item.statVersion === CURRENT_STAT_VERSION) {
    return item
  }
  
  // Generate expected stats with current formula
  const expected = generateExpectedStats(item)
  if (!expected) {
    // Can't migrate this item (unique, missing metadata, etc.)
    // Mark as current version anyway to avoid repeated attempts
    return {
      ...item,
      statVersion: CURRENT_STAT_VERSION,
    }
  }
  
  // Check if stats are already correct
  if (itemStatsAreCorrect(item, expected)) {
    console.log(`Item ${item.name} stats already correct, marking as version ${CURRENT_STAT_VERSION}`)
    return {
      ...item,
      statVersion: CURRENT_STAT_VERSION,
    }
  }
  
  // Stats are different - replace with corrected version
  const logKey = `${item.name}-${item.rarity}`
  if (!loggedStatMigrations.has(logKey)) {
    console.log(`Migrating ${item.name} (${item.rarity}) to stat version ${CURRENT_STAT_VERSION}`)
    console.log(`  Old stats:`, item.stats, `value: ${item.value}`)
    console.log(`  New stats:`, expected.stats, `value: ${expected.value}`)
    loggedStatMigrations.add(logKey)
  }
  
  return {
    ...item,
    stats: expected.stats,
    value: expected.value,
    statVersion: CURRENT_STAT_VERSION,
  }
}

/**
 * Migrate all items in an array
 */
export function migrateItemArray(items: Item[]): Item[] {
  return items.map(item => migrateItemStats(item))
}

/**
 * Migrate items on a hero (in all slots)
 */
export function migrateHeroItems(hero: Hero): Hero {
  const migratedSlots: typeof hero.slots = {}
  
  for (const [slotId, slotContent] of Object.entries(hero.slots)) {
    if (slotContent && 'type' in slotContent && !('consumableType' in slotContent)) {
      // It's an item (not a consumable)
      migratedSlots[slotId] = migrateItemStats(slotContent as Item)
    } else {
      migratedSlots[slotId] = slotContent
    }
  }
  
  return {
    ...hero,
    slots: migratedSlots,
  }
}

/**
 * Migrate items on all heroes in an array
 */
export function migrateHeroArrayItems(heroes: (Hero | null)[]): (Hero | null)[] {
  return heroes.map(hero => hero ? migrateHeroItems(hero) : null)
}
