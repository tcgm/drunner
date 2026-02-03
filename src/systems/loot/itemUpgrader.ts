import type { Item, ItemRarity, Hero } from '@/types'
import { generateItem } from './lootGenerator'
import { MATERIALS_BY_RARITY, getMaterialById, type Material } from '@/data/items/materials'
import { getBaseById, findBaseFromItemName } from '@/data/items/bases'

/**
 * Rarity tier ordering for upgrades
 * Includes all rarities from the ItemRarity type
 */
const RARITY_ORDER: ItemRarity[] = [
  // Base rarities (0-10 floors)
  'junk',
  'abundant',
  'common',
  'uncommon',
  // Mid rarities (11-30 floors)
  'rare',
  'veryRare',
  'magical',
  'elite',
  // High rarities (31-60 floors)
  'epic',
  'legendary',
  'mythic',
  'mythicc',
  // Ultra rarities (61-85 floors)
  'artifact',
  'divine',
  'celestial',
  // God rarities (86-95 floors)
  'realityAnchor',
  'structural',
  'singularity',
  'void',
  'elder',
  // Meta rarities (96-100+ floors)
  'layer',
  'plane',
  'author'
]

/**
 * Material tier ordering for upgrades
 * Materials are grouped by rarity and ordered within each rarity tier
 */
const MATERIAL_ORDER = [
  // Common tier
  'iron', 'leather', 'bronze',
  // Uncommon tier  
  'steel', 'reinforced-leather', 'silver',
  // Rare tier
  'mithril', 'dragonscale', 'enchanted',
  // Very Rare tier
  'obsidian', 'crystal', 'moonstone',
  // Magical tier
  'arcane', 'spectral', 'ethereal',
  // Epic tier
  'adamantine', 'celestial-mat', 'demon',
  // Legendary tier
  'divine-mat', 'ancient', 'voidstone',
  // Mythic tier
  'primordial', 'cosmic', 'eternal', 'adamantium',
  // Mythicc tier
  'ascended',
  // Divine tier
  'godforged',
  // Void tier
  'nullspace',
  // Author tier
  'narrative'
]

/**
 * Get the next rarity tier
 */
function getNextRarity(currentRarity: ItemRarity): ItemRarity | null {
  const currentIndex = RARITY_ORDER.indexOf(currentRarity)
  if (currentIndex === -1 || currentIndex >= RARITY_ORDER.length - 1) {
    return null // Already at max rarity
  }
  return RARITY_ORDER[currentIndex + 1]
}

/**
 * Get the next material tier
 */
function getNextMaterial(currentMaterialId: string): Material | null {
  const currentIndex = MATERIAL_ORDER.indexOf(currentMaterialId)
  if (currentIndex === -1 || currentIndex >= MATERIAL_ORDER.length - 1) {
    return null // Already at max material or not found
  }
  const nextMaterialId = MATERIAL_ORDER[currentIndex + 1]
  return getMaterialById(nextMaterialId)
}

/**
 * Extract material ID from item name
 * Returns null if no material prefix found
 */
function extractMaterialId(itemName: string): string | null {
  const words = itemName.split(' ')
  if (words.length < 2) return null

  const potentialMaterial = words[0].toLowerCase().replace(/[^a-z-]/g, '')

  // Check if this matches any known material
  for (const materials of Object.values(MATERIALS_BY_RARITY)) {
    for (const material of materials) {
      if (material.prefix.toLowerCase().replace(/[^a-z-]/g, '') === potentialMaterial) {
        return material.id
      }
    }
  }

  return null
}

/**
 * Find the lowest rarity equipped item from a party member
 * Excludes unique and set items from being upgraded
 */
export function findLowestRarityItem(hero: Hero): { item: Item; slot: string } | null {
  const slots = Object.keys(hero.slots)
  
  let lowestItem: { item: Item; slot: string } | null = null
  let lowestRarityIndex = RARITY_ORDER.length
  
  for (const slotId of slots) {
    const item = hero.slots[slotId]
    // Skip null slots, unique items, set items, and consumables
    if (item && 'stats' in item && !item.isUnique && !item.setId) {
      const rarityIndex = RARITY_ORDER.indexOf(item.rarity)
      if (rarityIndex !== -1 && rarityIndex < lowestRarityIndex) {
        lowestRarityIndex = rarityIndex
        lowestItem = { item, slot: slotId }
      }
    }
  }
  
  return lowestItem
}

/**
 * Find the lowest rarity item in a collection prioritizing lower rarities
 * Excludes unique and set items from being upgraded
 */
export function findLowestRarityItemInCollection(items: Item[]): Item | null {
  if (items.length === 0) return null
  
  let lowestItem: Item | null = null
  let lowestRarityIndex = RARITY_ORDER.length
  
  for (const item of items) {
    // Skip unique and set items
    if (!item.isUnique && !item.setId) {
      const rarityIndex = RARITY_ORDER.indexOf(item.rarity)
      if (rarityIndex !== -1 && rarityIndex < lowestRarityIndex) {
        lowestRarityIndex = rarityIndex
        lowestItem = item
      }
    }
  }
  
  return lowestItem
}

/**
 * Upgrade an item's material to the next tier
 * Returns a new item with better material but same rarity
 * Returns null if material cannot be upgraded
 */
export function upgradeItemMaterial(
  item: Item,
  depth: number
): Item | null {
  // Unique items and set items should never be upgraded
  if (item.isUnique || item.setId) {
    return null
  }

  const currentMaterialId = extractMaterialId(item.name)
  if (!currentMaterialId) {
    return null // No material prefix found
  }

  const nextMaterial = getNextMaterial(currentMaterialId)
  if (!nextMaterial) {
    return null // Already at max material
  }

  // Try to preserve the base template from the original item
  let baseTemplate = null
  if (item.baseTemplateId) {
    baseTemplate = getBaseById(item.baseTemplateId)
  }
  if (!baseTemplate) {
    baseTemplate = findBaseFromItemName(item.name, item.type)
  }

  // Generate a new item with the upgraded material, preserving base template
  const upgradedItem = generateItem(
    depth,
    item.type,
    item.rarity,
    item.rarity, // Keep same rarity
    0,
    baseTemplate || nextMaterial // Use base template if found, otherwise just material
  )

  return upgradedItem
}

/**
 * Upgrade an item by first upgrading material (keeping the same base), 
 * or if material is maxed, upgrade rarity
 * Returns a new item of the same type but better material or higher rarity
 * Unique items cannot be upgraded and will return null
 */
export function upgradeItemRarity(
  item: Item,
  depth: number,
  rarityBoost: number = 0
): Item | null {
  // Unique items and set items should never be upgraded
  if (item.isUnique || item.setId) {
    return null
  }
  
  // Try to upgrade material first - this preserves the base type
  const materialId = extractMaterialId(item)
  const nextMaterial = materialId ? getNextMaterial(materialId) : null
  
  if (nextMaterial) {
    // Can upgrade material - prioritize this to keep item identity
    return upgradeItemMaterial(item, depth)
  }

  // Material is maxed or not found - try upgrading rarity instead
  const nextRarity = getNextRarity(item.rarity)
  if (nextRarity) {
    // Try to preserve the base template from the original item
    let baseTemplate = null
    if (item.baseTemplateId) {
      baseTemplate = getBaseById(item.baseTemplateId)
    }
    if (!baseTemplate) {
      baseTemplate = findBaseFromItemName(item.name, item.type)
    }

    // Upgrade rarity while preserving base template
    const upgradedItem = generateItem(
      depth,
      item.type,
      nextRarity,
      nextRarity, // Force exactly the next rarity tier
      rarityBoost,
      baseTemplate // Preserve the base template
    )
    return upgradedItem
  }

  // Both material and rarity are maxed - cannot upgrade
  return null
}

/**
 * Get the rarity index for comparison
 */
export function getRarityIndex(rarity: ItemRarity): number {
  return RARITY_ORDER.indexOf(rarity)
}
