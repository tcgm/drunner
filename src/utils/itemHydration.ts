/**
 * Item Hydration Layer
 * Converts stored items (V2 or V3) into runtime Item format
 * This allows old and new formats to coexist
 */

import type { IconType } from 'react-icons'
import type { Item, ItemStorage, ItemV2, ItemV3, ProceduralItemV3, UniqueItemV3, SetItemV3 } from '@/types'
import { isItemV2, isItemV3, isProceduralItemV3, isUniqueItemV3, isSetItemV3 } from '@/types/items-v3'
import { restoreItemIcon } from './itemUtils'
import { getMaterialById } from '@/data/items/materials'
import { allBases } from '@/data/items/bases'
import { ALL_UNIQUE_ITEMS } from '@/data/items/uniques'
import { ALL_SET_ITEMS } from '@/data/items/sets'
import { getRarityConfig } from '@/systems/rarity/raritySystem'

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
 * Derive a full Item from V3 format
 */
function deriveItemFromV3(item: ItemV3): Item {
  if (isProceduralItemV3(item)) {
    return deriveProceduralItem(item)
  } else if (isUniqueItemV3(item)) {
    return deriveUniqueItem(item)
  } else if (isSetItemV3(item)) {
    return deriveSetItem(item)
  }
  
  console.error('Unknown V3 item type:', item)
  return createFallbackItem(item)
}

/**
 * Derive procedural item from material + base + rarity
 */
function deriveProceduralItem(item: ProceduralItemV3): Item {
  const material = getMaterialById(item.materialId)
  const baseTemplate = allBases.find(b => 
    `${b.type}_${b.description.split(' ')[0].toLowerCase()}` === item.baseTemplateId
  )
  
  if (!material || !baseTemplate) {
    console.warn(`Cannot derive procedural item ${item.id}: material=${!!material}, base=${!!baseTemplate}`)
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
    console.warn(`Cannot find unique template: ${item.templateId}`)
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
    console.warn(`Cannot find set template: ${item.templateId}`)
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
