/**
 * Item Hydration Layer
 * Converts stored items (V2 or V3) into runtime Item format
 * This allows old and new formats to coexist
 */

import type { IconType } from 'react-icons'
import type { Item, ItemStorage, ItemV2, ItemV3, ProceduralItemV3, UniqueItemV3, SetItemV3, ConsumableV3, Consumable, ConsumableEffect, ItemSlot } from '@/types'
import { isItemV2, isItemV3, isProceduralItemV3, isUniqueItemV3, isSetItemV3, isConsumableV3 } from '@/types/items-v3'
import { restoreItemIcon } from './itemUtils'
import { getMaterialById, ALL_MATERIALS } from '@/data/items/materials'
import { allBases, type BaseItemTemplate, getBasesByType } from '@/data/items/bases'
import { ALL_UNIQUE_ITEMS } from '@/data/items/uniques'
import { ALL_SET_ITEMS } from '@/data/items/sets'
import { getRarityConfig } from '@/systems/rarity/raritySystem'
import { getConsumableBaseById } from '@/data/consumables/bases'
import { getSizeById } from '@/data/consumables/sizes'
import { getPotencyById } from '@/data/consumables/potencies'
import { convertToV3, wasAttempted } from './itemConverter'
import {
  calculateProceduralStats,
  calculateUniqueStats,
  calculateSetStats,
  calculateItemValue,
  calculateConsumableValue,
  calculateConsumableEffectValues
} from './itemStatCalculation'

/**
 * Runtime cache for hydrated items
 * Key format includes modifiers for proper caching across variations
 * Format examples:
 * - Procedural: "procedural:{materialId}:{baseTemplateId}:{variantName}:{rarity}:{modifiers}"
 * - Consumable: "consumable:{baseId}:{sizeId}:{potencyId}:{rarity}:{modifiers}"
 * - Unique: "unique:{templateId}:{isUniqueRoll}:{modifiers}"
 * - Set: "set:{templateId}:{isUniqueRoll}:{modifiers}"
 * This cache is NOT persisted - it's regenerated each session
 */
const itemCache = new Map<string, Omit<Item, 'id' | 'modifiers'>>()

function getCacheKey(item: ItemV3): string {
  const modifiersKey = item.modifiers ? item.modifiers.sort().join(',') : ''

  if (isProceduralItemV3(item)) {
    return `procedural:${item.materialId}:${item.baseTemplateId}:${item.variantName}:${item.rarity}:${modifiersKey}`
  } else if (isUniqueItemV3(item)) {
    return `unique:${item.templateId}:false:${modifiersKey}`
  } else if (isSetItemV3(item)) {
    return `set:${item.templateId}:${item.isUniqueRoll || false}:${modifiersKey}`
  } else if (isConsumableV3(item)) {
    return `consumable:${item.baseId}:${item.sizeId}:${item.potencyId}:${item.rarity}:${modifiersKey}`
  }
  return ''
}

/**
 * Clear the runtime cache (useful for testing or when templates change)
 */
export function clearItemCache() {
  itemCache.clear()
}

/**
 * Main hydration function
 * Takes any stored item format and returns runtime Item
 * 
 * @param stored - The stored item (V2 or V3 format)
 * @param autoConvert - If true, attempts to convert V2 items to V3 automatically
 * @returns Object with hydrated item, conversion status, and V3 item if converted
 */
export function hydrateItem(
  stored: ItemStorage,
  autoConvert: boolean = false
): Item {
  if (isItemV2(stored)) {
    // V2 items work as-is, just restore icon if needed
    // Cast to Item since V2 and Item are compatible (icon will be restored)
    const restored = restoreItemIcon({ ...(stored as Item), version: 2 })
    return restored
  }
  
  if (isItemV3(stored)) {
    // V3 items: derive all properties from IDs and restore icon
    const derived = deriveItemFromV3(stored)
    return restoreItemIcon({ ...derived, version: 3 } as Item)
  }
  
  // Fallback for unknown format - return as-is
  console.error('Unknown item format, returning as-is:', stored)
  return restoreItemIcon(stored as Item)
}

/**
 * Enhanced hydration with conversion support
 * Returns additional metadata about conversion status
 */
export function hydrateItemWithConversion(
  stored: ItemStorage,
  autoConvert: boolean = false
): {
  hydratedItem: Item
  converted: boolean
  v3Item?: ItemV3
} {
  if (isItemV2(stored) && autoConvert) {
    // Check if already attempted conversion this session
    if (!wasAttempted(stored.id)) {
      // Attempt conversion
      const v3Item = convertToV3(stored)

      if (v3Item) {
        // Conversion succeeded - hydrate V3 item
        const derived = deriveItemFromV3(v3Item)
        const hydratedItem = { ...derived, version: 3 } as Item
        return {
          hydratedItem,
          converted: true,
          v3Item
        }
      }
      // Conversion failed - will be tracked in converter
    }

    // Conversion already attempted and failed, or just failed now
    // Hydrate V2 as-is
    const restored = restoreItemIcon({ ...(stored as Item), version: 2 })
    return {
      hydratedItem: restored,
      converted: false
    }
  }

  if (isItemV2(stored)) {
    // No auto-convert - just hydrate V2
    const restored = restoreItemIcon({ ...(stored as Item), version: 2 })
    return {
      hydratedItem: restored,
      converted: false
    }
  }

  if (isItemV3(stored)) {
    // Already V3 - hydrate and restore icon
    const derived = deriveItemFromV3(stored)
    const hydratedItem = restoreItemIcon({ ...derived, version: 3 } as Item)
    return {
      hydratedItem,
      converted: false
    }
  }

  // Fallback for unknown format - return as-is
  console.error('Unknown item format, returning as-is:', stored)
  return {
    hydratedItem: restoreItemIcon(stored as Item),
    converted: false
  }
}

/**
 * Hydrate multiple items (for inventories, equipment, etc)
 */
export function hydrateItems(items: ItemStorage[]): Item[] {
  return items.map(item => hydrateItem(item))
}

/**
 * Hydrate multiple items and separate out corrupted ones and V2 items
 * Returns {valid: Item[], corrupted: Item[], v2: Item[]}
 */
export function hydrateItemsWithDetails(items: ItemStorage[]): { valid: Item[], corrupted: Item[], v2: Item[] } {
  const valid: Item[] = []
  const corrupted: Item[] = []
  const v2: Item[] = []

  items.forEach(stored => {
    try {
      // Check if it's a V2 item before hydration
      if (isItemV2(stored)) {
        const item = restoreItemIcon({ ...(stored as Item), version: 2 })
        v2.push(item)
        valid.push(item) // Also add to valid so it can be used normally
        return
      }

      const hydrated = hydrateItem(stored)

      // Check if hydration resulted in a fallback/corrupted item
      if (hydrated.name === 'Corrupted Item' && hydrated.value === 100) {
        corrupted.push(hydrated)
      } else {
        valid.push(hydrated)
      }
    } catch (error) {
      console.error('Failed to hydrate item:', stored, error)
      // Return item as-is
      const original = stored as Item
      corrupted.push(restoreItemIcon(original))
    }
  })

  return { valid, corrupted, v2 }
}

/**
 * Hydrate multiple items and separate out corrupted ones
 * Returns {valid: Item[], corrupted: Item[]}
 */
export function hydrateItemsWithCorrupted(items: ItemStorage[]): { valid: Item[], corrupted: Item[] } {
  // console.log(`[Hydrate] Starting with ${items.length} stored items`)
  const valid: Item[] = []
  const corrupted: Item[] = []

  items.forEach(stored => {
    try {
      const hydrated = hydrateItem(stored)
      valid.push(hydrated)
    } catch (error) {
      console.error('Failed to hydrate item:', stored, error)
      // Return item as-is
      const original = stored as Item
      corrupted.push(restoreItemIcon(original))
    }
  })

  // console.log(`[Hydrate] Result: ${valid.length} valid, ${corrupted.length} corrupted`)
  return { valid, corrupted }
}

/**
 * Derive a full Item from V3 format
 */
function deriveItemFromV3(item: ItemV3): Item {
  // Check cache first
  const cacheKey = getCacheKey(item)
  const cached = itemCache.get(cacheKey)

  if (cached) {
    // Return cached data with this item's unique ID and modifiers
    // For consumables with stackCount, include that too
    if (isConsumableV3(item) && item.stackCount) {
      return {
        ...cached,
        id: item.id,
        modifiers: item.modifiers,
        stackCount: item.stackCount,
      } as Consumable
    }
    return {
      ...cached,
      id: item.id,
      modifiers: item.modifiers,
    }
  }

  // Not in cache - derive from templates
  let derived: Item
  if (isProceduralItemV3(item)) {
    derived = deriveProceduralItem(item)
  } else if (isUniqueItemV3(item)) {
    derived = deriveUniqueItem(item)
  } else if (isSetItemV3(item)) {
    derived = deriveSetItem(item)
  } else if (isConsumableV3(item)) {
    derived = deriveConsumableItem(item)
  } else {
    console.error('Unknown V3 item type, returning as Item:', item)
    return item as unknown as Item
  }

  // Cache the result (excluding id, modifiers, and stackCount which are instance-specific)
  const { id, modifiers, stackCount, ...cacheableData } = derived as Item & { stackCount?: number }
  itemCache.set(cacheKey, cacheableData)

  return derived
}

/**
 * Derive procedural item from material + base + rarity
 */
function deriveProceduralItem(item: ProceduralItemV3): Item {
  const material = getMaterialById(item.materialId)

  // Support both variantName (current) and baseName (legacy) field names
  const storedVariantName = item.variantName || (item as any).baseName || ''

  // Extract item type from baseTemplateId for getBasesByType
  // Handle both dot format (weapon.sword) and underscore format (weapon_sword)
  const extractedType = item.baseTemplateId.includes('.')
    ? item.baseTemplateId.split('.')[0]
    : item.baseTemplateId.split('_')[0]

  // Use getBasesByType which handles accessory1/accessory2 normalization
  const availableBases = getBasesByType(extractedType as ItemSlot)

  let baseTemplate: BaseItemTemplate | undefined

  // Method 1: Try matching by variantName/baseName against baseNames array
  if (storedVariantName && storedVariantName.trim()) {
    baseTemplate = availableBases.find((b: BaseItemTemplate) =>
      b.baseNames?.some((name: string) => name && name.toLowerCase() === storedVariantName.toLowerCase())
    )
    if (baseTemplate) {
      // console.log(`[ItemHydration] Matched by variantName "${storedVariantName}" to base "${baseTemplate.id}"`)
    }
  }

  // Method 2: Try new dot format - "type.id" (e.g., "weapon.sword")
  if (!baseTemplate) {
    baseTemplate = availableBases.find((b: BaseItemTemplate) =>
      `${b.type}.${b.id}` === item.baseTemplateId
    )
  }

  // Method 3: Try matching baseTemplateId keyword against baseNames
  if (!baseTemplate) {
    const idPart = item.baseTemplateId.includes('.')
      ? item.baseTemplateId.split('.')[1]
      : item.baseTemplateId.split('_').slice(1).join('_').trim()

    if (idPart) {
      // Try exact match on ID part
      baseTemplate = availableBases.find((b: BaseItemTemplate) =>
        b.id.toLowerCase() === idPart.toLowerCase() ||
        b.baseNames?.some((name: string) => name && name.toLowerCase() === idPart.toLowerCase())
      )

      // Try partial match (for truncated IDs like "accessory2_a")
      if (!baseTemplate) {
        baseTemplate = availableBases.find((b: BaseItemTemplate) =>
          b.id.toLowerCase().includes(idPart.toLowerCase()) ||
          b.baseNames?.some((name: string) => name && name.toLowerCase().includes(idPart.toLowerCase()))
        )
        if (baseTemplate) {
          console.warn(`[ItemHydration] Matched partial baseTemplateId "${item.baseTemplateId}" to base "${baseTemplate.id}"`)
        }
      }
    }
  }

  // Method 4: Fallback to first base of this type
  if (!baseTemplate && availableBases.length > 0) {
    baseTemplate = availableBases[0]
    console.warn(`[ItemHydration] Using fallback base "${baseTemplate!.id}" for baseTemplateId "${item.baseTemplateId}"`)
  }

  if (!material || !baseTemplate) {
    console.warn(`[ItemHydration] Cannot derive procedural item ${item.id}: material=${!!material}, base=${!!baseTemplate}, materialId=${item.materialId}, baseTemplateId=${item.baseTemplateId}, variantName=${storedVariantName}`)
    console.warn(`[ItemHydration] Returning item as-is without modification`)
    return item as unknown as Item
  }
  
  // Derive itemSlot from base.type
  // The type field directly maps to ItemSlot for all base templates
  const itemSlot: ItemSlot = baseTemplate.type as ItemSlot

  // Calculate stats using centralized stat calculation
  const stats = calculateProceduralStats(baseTemplate, material, item.rarity, item.modifiers)
  
  // Select variant name from baseNames array
  let selectedVariant = storedVariantName
  if (baseTemplate.baseNames && baseTemplate.baseNames.length > 0 && storedVariantName) {
    // Try to find exact match (case-insensitive)
    const matchingVariant = baseTemplate.baseNames.find(
      name => name.toLowerCase() === storedVariantName.toLowerCase()
    )
    selectedVariant = matchingVariant || baseTemplate.baseNames[0] // Fallback to first variant
  } else if (baseTemplate.baseNames && baseTemplate.baseNames.length > 0) {
    // No stored variant name, use first from template
    selectedVariant = baseTemplate.baseNames[0]
  }

  // Generate name using material prefix + variant name
  const name = `${material.prefix} ${selectedVariant}`
  
  // Generate description
  const description = material.description
    ? `${baseTemplate.description} - ${material.description}`
    : baseTemplate.description
  
  // Calculate value using centralized calculation
  const baseValue = 50
  const value = calculateItemValue(baseValue, material, item.rarity, item.modifiers)
  
  // Get icon (check for variantName-specific icon)
  let icon = baseTemplate.icon
  if ('baseNameIcons' in baseTemplate && baseTemplate.baseNameIcons && selectedVariant) {
    const specificIcon = (baseTemplate.baseNameIcons as Record<string, IconType>)[selectedVariant]
    if (specificIcon) {
      icon = specificIcon
    }
  }
  
  return {
    id: item.id,
    name,
    description,
    type: itemSlot,
    rarity: item.rarity,
    stats,
    value,
    icon,
    materialId: item.materialId,
    baseTemplateId: item.baseTemplateId,
    isUnique: false,
    modifiers: item.modifiers,
    version: 3,
  }
}

/**
 * Derive unique item from template
 */
function deriveUniqueItem(item: UniqueItemV3): Item {
  // Find template by matching the constant name
  const template = ALL_UNIQUE_ITEMS.find(t => {
    // Convert template name to constant format for matching
    const constantName = t.name.toUpperCase().replace(/['\s]/g, '_')
    return item.templateId === constantName || t.name === item.templateId
  })
  
  if (!template) {
    console.warn(`[ItemHydration] Cannot find unique template: ${item.templateId}, returning as-is`)
    return item as unknown as Item
  }
  
  // Determine effective rarity (use stored rarity if present, else template rarity)
  const effectiveRarity = item.rarity || template.rarity

  // Calculate stats using centralized calculation (includes rarity multiplier + unique 30% boost)
  const stats = calculateUniqueStats(template.stats, template.rarity, item.rarity, item.modifiers)

  // Calculate value: base value × rarity multiplier × unique boost (1.3)
  const rarityConfig = getRarityConfig(effectiveRarity)
  const value = Math.floor(template.value * rarityConfig.statMultiplierBase * 1.3)
  
  return {
    id: item.id,
    name: template.name,
    description: template.description,
    type: template.type,
    rarity: effectiveRarity,
    stats,
    value,
    icon: template.icon,
    isUnique: true,
    modifiers: item.modifiers,
    version: 3,
  }
}

/**
 * Derive set item from template
 */
function deriveSetItem(item: SetItemV3): Item {
  // Find template
  const template = ALL_SET_ITEMS.find(t => {
    const constantName = t.name.toUpperCase().replace(/['\s]/g, '_')
    return item.templateId === constantName || t.name === item.templateId
  })
  
  if (!template) {
    console.warn(`[ItemHydration] Cannot find set template: ${item.templateId}, returning as-is`)
    return item as unknown as Item
  }
  
  // Determine effective rarity (use stored rarity if present, else template rarity)
  const effectiveRarity = item.rarity || template.rarity

  // Calculate stats using centralized calculation (handles rarity multiplier + unique roll boost if applicable)
  const stats = calculateSetStats(
    template.stats,
    template.rarity,
    item.rarity,
    item.isUniqueRoll || false,
    item.modifiers
  )
  
  // Calculate value: base value × rarity multiplier × [unique boost if applicable]
  const uniqueBoost = item.isUniqueRoll ? 1.3 : 1.0
  const rarityConfig = getRarityConfig(effectiveRarity)
  const value = Math.floor(template.value * rarityConfig.statMultiplierBase * uniqueBoost)
  
  // Get setId from template name
  const setId = template.name.split("'")[0] // "Titan's Guard" -> "Titan"
  
  return {
    id: item.id,
    name: template.name,
    description: template.description,
    type: template.type,
    rarity: effectiveRarity,
    stats,
    value,
    icon: template.icon,
    setId,
    isUnique: item.isUniqueRoll,
    modifiers: item.modifiers,
    version: 3,
  }
}

/**
 * Derive consumable from base + size + potency + rarity
 */
function deriveConsumableItem(item: ConsumableV3): Consumable {
  const base = getConsumableBaseById(item.baseId)
  const size = getSizeById(item.sizeId)
  const potency = getPotencyById(item.potencyId)

  if (!base || !size || !potency) {
    console.error(`[ItemHydration] Cannot derive consumable: base=${!!base}, size=${!!size}, potency=${!!potency}, returning as-is`)
    return item as unknown as Consumable
  }

  // Calculate effects using centralized calculation
  const effects: ConsumableEffect[] = base.effects.map(effect => {
    if (effect.value !== undefined) {
      const finalValue = calculateConsumableEffectValues(
        effect.value,
        size.multiplier,
        potency.multiplier,
        item.rarity
      )
      return {
        ...effect,
        value: finalValue
      }
    }
    return effect
  })

  // Generate name: "{Potency} {Size} {Base}"
  const name = `${potency.prefix} ${size.prefix} ${base.name}`

  // Generate description from base
  const description = base.description

  // Calculate value using centralized calculation
  const value = calculateConsumableValue(
    base.baseGoldValue,
    size.valueMultiplier,
    potency.valueMultiplier,
    item.rarity
  )

  return {
    id: item.id,
    name,
    description,
    type: 'consumable' as const,
    rarity: item.rarity,
    stats: {}, // Consumables don't have stat bonuses
    value,
    icon: base.icon,
    consumableType: 'potion', // Default type - could be derived from base if needed
    effects,
    usableInCombat: base.usableInCombat,
    usableOutOfCombat: base.usableOutOfCombat,
    stackable: true, // Most consumables are stackable
    stackCount: item.stackCount || 1,
    baseId: item.baseId,
    sizeId: item.sizeId,
    potencyId: item.potencyId,
    modifiers: item.modifiers,
    version: 3,
  }
}

/**
 * Create fallback item for corrupted/unknown data
 */
function createFallbackItem(data: Partial<Item> & { id?: string }): Item {
  return {
    id: (typeof data.id === 'string' ? data.id : 'corrupted'),
    name: 'Corrupted Item',
    description: 'This item data is corrupted or uses an unknown format. It can be sold for salvage value.',
    type: 'weapon',
    rarity: 'common',
    stats: {},
    value: 100,
    icon: undefined as unknown as IconType, // Will be restored by restoreItemIcon
  }
}

/**
 * Dehydrate an Item to V3 storage format
 * Strips all computed data (description, stats, icon) and keeps only IDs
 */
export function dehydrateItem(item: Item): ItemV3 {
  // Check if item has explicit V3 version marker (already converted)
  // Only V3-native items should be dehydrated to V3 format
  const hasV3Marker = 'version' in item && (item as Item & { version: number }).version === 3

  // Only auto-convert items that are already marked as V3
  // This prevents auto-converting V2 consumables and uniques during save

  // Check if it's a consumable
  if (hasV3Marker && 'consumableType' in item && 'baseId' in item && 'sizeId' in item && 'potencyId' in item) {
    const consumable = item as Consumable
    if (consumable.baseId && consumable.sizeId && consumable.potencyId) {
      return {
        version: 3,
        id: item.id,
        itemType: 'consumable',
        baseId: consumable.baseId,
        sizeId: consumable.sizeId,
        potencyId: consumable.potencyId,
        rarity: item.rarity,
        stackCount: consumable.stackCount,
        modifiers: item.modifiers,
      }
    }
  }

  // Check if it's a unique item
  if (hasV3Marker && item.isUnique && !item.setId) {
    // Unique item
    const templateId = item.name.toUpperCase().replace(/['\s]/g, '_')
    return {
      version: 3,
      id: item.id,
      itemType: 'unique',
      templateId,
      rarity: item.rarity,  // Store rarity for variable-rarity uniques
      modifiers: item.modifiers,
    }
  }

  // Check if it's a set item
  if (hasV3Marker && item.setId) {
    const templateId = item.name.toUpperCase().replace(/['\s]/g, '_')
    return {
      version: 3,
      id: item.id,
      itemType: 'set',
      templateId,
      rarity: item.rarity,  // Store rarity for variable-rarity sets
      isUniqueRoll: item.isUnique,
      modifiers: item.modifiers,
    }
  }

  // Procedural item - try to get or recover materialId and baseTemplateId
  let materialId = item.materialId
  let baseTemplateId = item.baseTemplateId

  // Validate that materialId and baseTemplateId actually exist
  if (materialId) {
    const material = getMaterialById(materialId)
    if (!material) {
      // console.warn(`Item ${item.id} (${item.name || 'unknown'}) has invalid materialId "${materialId}", keeping as V2`)
      // Explicitly mark as V2 to prevent future processing
      return { ...item, version: 2 } as unknown as ItemV3
    }
  }

  if (baseTemplateId) {
    // Check if baseTemplateId can be found
    const base = allBases.find(b => {
      // Check new format first (armor.vest)
      const newFormatId = b.id ? `${b.type}.${b.id}` : null
      if (newFormatId === baseTemplateId) return true

      // Fall back to old format (armor_vest) for backward compatibility
      const oldFormatId = b.baseNames
        ? `${b.type}_${b.baseNames[0].toLowerCase()}`
        : `${b.type}_${b.type}`
      return oldFormatId === baseTemplateId
    })
    if (!base) {
      // console.warn(`Item ${item.id} (${item.name || 'unknown'}) has invalid baseTemplateId "${baseTemplateId}", keeping as V2`)
      // Explicitly mark as V2 to prevent future processing
      return { ...item, version: 2 } as unknown as ItemV3
    }
  }

  // If missing, try to extract from item name
  if (!materialId || !baseTemplateId) {
    // Check if item has a valid name to recover from
    if (!item.name || typeof item.name !== 'string') {
      // console.warn(`Item ${item.id} has invalid/missing name and metadata, keeping as V2`)
      return item as unknown as ItemV3
    }

    // console.warn(`Item ${item.id} (${item.name}) missing metadata, attempting to recover from name`)

    // Try to find material by checking if name starts with a material prefix
    if (!materialId) {
      const foundMaterial = ALL_MATERIALS.find(m =>
        item.name.toLowerCase().startsWith(m.prefix.toLowerCase() + ' ')
      )
      if (foundMaterial) {
        materialId = foundMaterial.id
        console.log(`Recovered materialId: ${materialId} for item ${item.name}`)
      }
    }

    // Try to find base template by matching item name parts
    if (!baseTemplateId && materialId) {
      // Remove material prefix from name
      const material = getMaterialById(materialId)
      const nameWithoutMaterial = material
        ? item.name.substring(material.prefix.length + 1).trim()
        : item.name

      // Try to find matching base template
      const foundBase = allBases.find(b =>
        b.type === item.type &&
        b.baseNames &&
        b.baseNames.some(baseName => baseName.toLowerCase() === nameWithoutMaterial.toLowerCase())
      )

      if (foundBase) {
        baseTemplateId = foundBase.baseNames
          ? `${foundBase.type}_${foundBase.baseNames[0].toLowerCase()}`
          : `${foundBase.type}_${foundBase.type}` // fallback
        console.log(`Recovered baseTemplateId: ${baseTemplateId} for item ${item.name}`)
      }
    }
  }

  // If we still don't have both IDs, return as V2
  if (!materialId || !baseTemplateId) {
    // console.warn(`Cannot recover metadata for item ${item.id} (${item.name || 'unknown'}), keeping as V2`)
    return item as unknown as ItemV3
  }

  // Extract variant name from full item name (remove material prefix)
  // Safety check - if name is missing at this point, we can't proceed
  if (!item.name || typeof item.name !== 'string') {
    // console.warn(`Item ${item.id} has metadata but missing name, keeping as V2`)
    return item as unknown as ItemV3
  }

  const material = getMaterialById(materialId)
  const variantName = material
    ? item.name.substring(material.prefix.length + 1).trim()
    : item.name

  return {
    version: 3,
    id: item.id,
    itemType: 'procedural',
    type: item.type as 'weapon' | 'armor' | 'helmet' | 'boots' | 'accessory',
    materialId,
    baseTemplateId,
    variantName,
    rarity: item.rarity,
    modifiers: item.modifiers,
  }
}

/**
 * Dehydrate multiple items
 */
export function dehydrateItems(items: Item[]): ItemV3[] {
  console.log(`[Dehydrate] Starting with ${items.length} items`)
  const dehydrated = items.map(dehydrateItem)
  console.log(`[Dehydrate] Produced ${dehydrated.length} items`)

  // Check for any undefined/null items
  const filtered = dehydrated.filter(item => item != null)
  if (filtered.length !== dehydrated.length) {
    console.log(`[Dehydrate] Filtered out ${dehydrated.length - filtered.length} null/undefined items`)
  }

  return filtered
}
