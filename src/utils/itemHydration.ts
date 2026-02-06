/**
 * Item Hydration Layer
 * Converts stored items (V2 or V3) into runtime Item format
 * This allows old and new formats to coexist
 */

import type { IconType } from 'react-icons'
import type { Item, ItemStorage, ItemV2, ItemV3, ProceduralItemV3, UniqueItemV3, SetItemV3, ConsumableV3, Consumable, ConsumableEffect } from '@/types'
import { isItemV2, isItemV3, isProceduralItemV3, isUniqueItemV3, isSetItemV3, isConsumableV3 } from '@/types/items-v3'
import { restoreItemIcon } from './itemUtils'
import { getMaterialById, ALL_MATERIALS } from '@/data/items/materials'
import { allBases } from '@/data/items/bases'
import { ALL_UNIQUE_ITEMS } from '@/data/items/uniques'
import { ALL_SET_ITEMS } from '@/data/items/sets'
import { getRarityConfig } from '@/systems/rarity/raritySystem'
import { getConsumableBaseById } from '@/data/consumables/bases'
import { getSizeById } from '@/data/consumables/sizes'
import { getPotencyById } from '@/data/consumables/potencies'

/**
 * Runtime cache for hydrated items
 * Key format: "procedural:{materialId}:{baseTemplateId}:{baseName}:{rarity}" or "unique:{templateId}" or "set:{templateId}:{isUnique}"
 * This cache is NOT persisted - it's regenerated each session
 */
const itemCache = new Map<string, Omit<Item, 'id' | 'modifiers'>>()

function getCacheKey(item: ItemV3): string {
  if (isProceduralItemV3(item)) {
    return `procedural:${item.materialId}:${item.baseTemplateId}:${item.baseName}:${item.rarity}`
  } else if (isUniqueItemV3(item)) {
    return `unique:${item.templateId}`
  } else if (isSetItemV3(item)) {
    return `set:${item.templateId}:${item.isUniqueRoll || false}`
  } else if (isConsumableV3(item)) {
    return `consumable:${item.baseId}:${item.sizeId}:${item.potencyId}:${item.rarity}`
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
 */
export function hydrateItem(stored: ItemStorage): Item {
  if (isItemV2(stored)) {
    // V2 items work as-is, just restore icon if needed
    // Cast to Item since V2 and Item are compatible (icon will be restored)
    const restored = restoreItemIcon(stored as Item)
    return restored
  }
  
  if (isItemV3(stored)) {
    // V3 items: derive all properties from IDs
    return deriveItemFromV3(stored)
  }
  
  // Fallback for corrupted data
  console.error('Unknown item format:', stored)
  return createFallbackItem(stored)
}

/**
 * Hydrate multiple items (for inventories, equipment, etc)
 */
export function hydrateItems(items: ItemStorage[]): Item[] {
  return items.map(hydrateItem)
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
        const item = restoreItemIcon(stored as Item)
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
      if (isItemV2(stored)) {
        const original = stored as Item
        corrupted.push(restoreItemIcon(original))
      } else {
        const fallback = createFallbackItem(stored)
        corrupted.push(fallback)
      }
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

      // Check if hydration resulted in a fallback/corrupted item
      // Fallback items have the name "Corrupted Item" and value of 100
      if (hydrated.name === 'Corrupted Item' && hydrated.value === 100) {
        // This is a fallback item - it failed to hydrate properly
        // Try to preserve original data if it exists
        if (isItemV2(stored)) {
          const original = stored as Item
          // If the original has better data, use it
          if (original.name && original.name !== 'Corrupted Item') {
            corrupted.push(restoreItemIcon(original))
            return
          }
        }
        corrupted.push(hydrated)
      } else {
        valid.push(hydrated)
      }
    } catch (error) {
      console.error('Failed to hydrate item:', stored, error)
      // Try to preserve original if it's V2
      if (isItemV2(stored)) {
        const original = stored as Item
        corrupted.push(restoreItemIcon(original))
      } else {
        const fallback = createFallbackItem(stored)
        corrupted.push(fallback)
      }
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
    console.error('Unknown V3 item type:', item)
    return createFallbackItem(item)
  }

  // Cache the result (excluding id, modifiers, and stackCount which are instance-specific)
  const { id, modifiers, stackCount, ...cacheableData } = derived as any
  itemCache.set(cacheKey, cacheableData)

  return derived
}

/**
 * Derive procedural item from material + base + rarity
 */
function deriveProceduralItem(item: ProceduralItemV3): Item {
  const material = getMaterialById(item.materialId)

  // Try multiple methods to find the base template
  let baseTemplate = allBases.find(b => 
    `${b.type}_${b.description.split(' ')[0].toLowerCase()}` === item.baseTemplateId
  )
  
  // If not found, try matching by type and baseName
  if (!baseTemplate && item.baseName) {
    baseTemplate = allBases.find(b =>
      b.type === item.itemSlot &&
      b.baseNames &&
      b.baseNames.some(name => name.toLowerCase() === item.baseName.toLowerCase())
    )
  }

  // If still not found, try just by item type as last resort
  if (!baseTemplate) {
    const basesByType = allBases.filter(b => b.type === item.itemSlot)
    if (basesByType.length > 0) {
      baseTemplate = basesByType[0]
      // console.warn(`Using fallback base template for item ${item.id}, baseTemplateId: ${item.baseTemplateId}`)
    }
  }

  if (!material || !baseTemplate) {
    // console.warn(`Cannot derive procedural item ${item.id}: material=${!!material}, base=${!!baseTemplate}, materialId=${item.materialId}, baseTemplateId=${item.baseTemplateId}, baseName=${item.baseName}`)
    return createFallbackItem(item)
  }
  
  const rarityConfig = getRarityConfig(item.rarity)
  const rarityMultiplier = rarityConfig.statMultiplierBase
  const materialMultiplier = material.statMultiplier
  
  // Calculate stats: base × material × rarity
  const stats: Item['stats'] = {}
  for (const [key, baseValue] of Object.entries(baseTemplate.stats)) {
    if (typeof baseValue === 'number') {
      stats[key as keyof typeof stats] = Math.floor(baseValue * materialMultiplier * rarityMultiplier)
    }
  }
  
  // Apply modifiers if present
  // TODO: Apply modifier stats once modifier system is updated
  
  // Generate name
  const name = `${material.prefix} ${item.baseName}`
  
  // Generate description
  const description = material.description
    ? `${baseTemplate.description} - ${material.description}`
    : baseTemplate.description
  
  // Calculate value
  const baseValue = 50
  const value = Math.floor(baseValue * material.valueMultiplier * rarityMultiplier)
  
  // Get icon (check for baseName-specific icon)
  let icon = baseTemplate.icon
  if ('baseNameIcons' in baseTemplate && baseTemplate.baseNameIcons && item.baseName) {
    const specificIcon = (baseTemplate.baseNameIcons as Record<string, IconType>)[item.baseName]
    if (specificIcon) {
      icon = specificIcon
    }
  }
  
  return {
    id: item.id,
    name,
    description,
    type: item.itemSlot,
    rarity: item.rarity,
    stats,
    value,
    icon,
    materialId: item.materialId,
    baseTemplateId: item.baseTemplateId,
    isUnique: false,
    modifiers: item.modifiers,
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
    // console.warn(`Cannot find unique template: ${item.templateId}`)
    return createFallbackItem(item)
  }
  
  // Apply modifiers if present
  const stats = { ...template.stats }
  // TODO: Apply modifier stats
  
  return {
    id: item.id,
    name: template.name,
    description: template.description,
    type: template.type,
    rarity: template.rarity,
    stats,
    value: template.value,
    icon: template.icon,
    isUnique: true,
    modifiers: item.modifiers,
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
    // console.warn(`Cannot find set template: ${item.templateId}`)
    return createFallbackItem(item)
  }
  
  const rarityConfig = getRarityConfig(template.rarity)
  const rarityMultiplier = rarityConfig.statMultiplierBase
  
  // Apply rarity multiplier to template stats
  const stats: Item['stats'] = {}
  for (const [key, baseValue] of Object.entries(template.stats)) {
    if (typeof baseValue === 'number') {
      stats[key as keyof typeof stats] = Math.floor(baseValue * rarityMultiplier)
    }
  }
  
  // If unique roll, apply boost
  const uniqueBoost = item.isUniqueRoll ? 1.3 : 1.0
  if (item.isUniqueRoll) {
    for (const [key, value] of Object.entries(stats)) {
      if (typeof value === 'number') {
        stats[key as keyof typeof stats] = Math.floor(value * uniqueBoost)
      }
    }
  }
  
  const value = item.isUniqueRoll
    ? Math.floor(template.value * rarityMultiplier * uniqueBoost)
    : Math.floor(template.value * rarityMultiplier)
  
  // Get setId from template name
  const setId = template.name.split("'")[0] // "Titan's Guard" -> "Titan"
  
  return {
    id: item.id,
    name: template.name,
    description: template.description,
    type: template.type,
    rarity: template.rarity,
    stats,
    value,
    icon: template.icon,
    setId,
    isUnique: item.isUniqueRoll,
    modifiers: item.modifiers,
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
    // console.warn(`Cannot derive consumable ${item.id}: base=${!!base}, size=${!!size}, potency=${!!potency}`)
    return createFallbackItem(item) as Consumable
  }

  const rarityConfig = getRarityConfig(item.rarity)

  // Calculate effects
  const effects: ConsumableEffect[] = base.effects.map(effect => {
    if (effect.value !== undefined) {
      // Apply size and potency multipliers
      const baseValue = effect.value * size.multiplier * potency.multiplier
      // Apply rarity bonus
      const finalValue = Math.floor(baseValue * rarityConfig.statMultiplierBase)
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

  // Calculate value
  const value = Math.floor(base.baseGoldValue * size.valueMultiplier * potency.valueMultiplier * rarityConfig.statMultiplierBase)

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
  // Check if it's a consumable
  if ('consumableType' in item && 'baseId' in item && 'sizeId' in item && 'potencyId' in item) {
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
  if (item.isUnique && !item.setId) {
    // Unique item
    const templateId = item.name.toUpperCase().replace(/['\s]/g, '_')
    return {
      version: 3,
      id: item.id,
      itemType: 'unique',
      templateId,
      modifiers: item.modifiers,
    }
  }

  // Check if it's a set item
  if (item.setId) {
    const templateId = item.name.toUpperCase().replace(/['\s]/g, '_')
    return {
      version: 3,
      id: item.id,
      itemType: 'set',
      templateId,
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
      return { ...item, version: 2 } as any as ItemV3
    }
  }

  if (baseTemplateId) {
    // Check if baseTemplateId can be found
    const base = allBases.find(b => {
      const expectedId = b.baseNames
        ? `${b.type}_${b.baseNames[0].toLowerCase()}`
        : `${b.type}_${b.type}` // fallback if no baseNames
      return expectedId === baseTemplateId
    })
    if (!base) {
      // console.warn(`Item ${item.id} (${item.name || 'unknown'}) has invalid baseTemplateId "${baseTemplateId}", keeping as V2`)
      // Explicitly mark as V2 to prevent future processing
      return { ...item, version: 2 } as any as ItemV3
    }
  }

  // If missing, try to extract from item name
  if (!materialId || !baseTemplateId) {
    // Check if item has a valid name to recover from
    if (!item.name || typeof item.name !== 'string') {
      // console.warn(`Item ${item.id} has invalid/missing name and metadata, keeping as V2`)
      return item as any as ItemV3
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
    return item as any as ItemV3
  }

  // Extract base name from full item name (remove material prefix)
  // Safety check - if name is missing at this point, we can't proceed
  if (!item.name || typeof item.name !== 'string') {
    // console.warn(`Item ${item.id} has metadata but missing name, keeping as V2`)
    return item as any as ItemV3
  }

  const material = getMaterialById(materialId)
  const baseName = material
    ? item.name.substring(material.prefix.length + 1).trim()
    : item.name

  return {
    version: 3,
    id: item.id,
    itemType: 'procedural',
    materialId,
    baseTemplateId,
    baseName,
    rarity: item.rarity,
    itemSlot: item.type,
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
