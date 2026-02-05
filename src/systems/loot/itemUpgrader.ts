import type { Item, ItemRarity, Hero, Stats } from '@/types'
import { generateItem } from './lootGenerator'
import { MATERIALS_BY_RARITY, getMaterialById, type Material } from '@/data/items/materials'
import { getBaseById, findBaseFromItemName } from '@/data/items/bases'
import { getRarityConfig } from '@/systems/rarity/raritySystem'
import { v4 as uuidv4 } from 'uuid'

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
  // Epic tier (adamantine is upgradeable to, celestial/demon are skipped)
  'adamantine', 'celestial', 'demon',
  // Legendary tier
  'divine', 'ancient', 'voidstone',
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
 * Materials that can be upgraded FROM but not upgraded TO
 * These are thematic variants that should only be found/generated
 */
const UPGRADE_BLACKLIST = new Set(['celestial', 'demon'])

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
 * Get the next material tier, skipping blacklisted materials
 */
function getNextMaterial(currentMaterialId: string): Material | null {
  const currentIndex = MATERIAL_ORDER.indexOf(currentMaterialId)
  if (currentIndex === -1 || currentIndex >= MATERIAL_ORDER.length - 1) {
    return null // Already at max material or not found
  }
  
  // Find next non-blacklisted material
  for (let i = currentIndex + 1; i < MATERIAL_ORDER.length; i++) {
    const nextMaterialId = MATERIAL_ORDER[i]
    if (!UPGRADE_BLACKLIST.has(nextMaterialId)) {
      return getMaterialById(nextMaterialId) || null
    }
  }
  
  return null // No valid next material found
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
 * Extract base name from item name (removes material prefix)
 * Returns the base name or empty string if can't extract
 */
function extractBaseName(itemName: string): string {
  const words = itemName.split(' ')
  if (words.length < 2) return itemName
  
  // Remove first word (material prefix) and return the rest
  return words.slice(1).join(' ')
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
    // Skip null slots, unique items, set items, consumables, and alkahest shards
    if (item && 'stats' in item && !('consumableType' in item) && !item.isUnique && !item.setId && item.name !== 'Alkahest Shard') {
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
    // Skip unique items, set items, consumables, and alkahest shards
    if (!('consumableType' in item) && !item.isUnique && !item.setId && item.name !== 'Alkahest Shard') {
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
 * Check if an item can have its material upgraded
 */
export function canUpgradeMaterial(item: Item): boolean {
  if (item.isUnique || item.setId || item.name === 'Alkahest Shard') {
    return false
  }
  
  const currentMaterialId = extractMaterialId(item.name)
  if (!currentMaterialId) return false
  
  const nextMaterial = getNextMaterial(currentMaterialId)
  return nextMaterial !== null
}

/**
 * Check if an item can have its rarity upgraded
 */
export function canUpgradeRarity(item: Item): boolean {
  if (item.isUnique || item.setId || item.name === 'Alkahest Shard') {
    return false
  }
  
  const nextRarity = getNextRarity(item.rarity)
  return nextRarity !== null
}

/**
 * Check if an item can be upgraded (material or rarity)
 */
export function canUpgradeItem(item: Item, upgradeType: 'material' | 'rarity' | 'auto'): boolean {
  if (upgradeType === 'material') {
    return canUpgradeMaterial(item)
  } else if (upgradeType === 'rarity') {
    return canUpgradeRarity(item)
  } else {
    // auto: can upgrade if either material or rarity can be upgraded
    return canUpgradeMaterial(item) || canUpgradeRarity(item)
  }
}

/**
 * Main upgrade function that handles both material and rarity upgrades
 * Returns a new upgraded item or null if upgrade is not possible
 * 
 * Process:
 * 1. Extract material name from item name and FIND it in materials data
 * 2. Extract base name from item name and FIND it in bases data
 * 3. Get rarity from item data
 * 4. Upgrade material or rarity using data files
 * 5. Construct new item name from found data (material.prefix + base.baseName)
 */
function upgradeItem(
  item: Item,
  depth: number,
  upgradeType: 'material' | 'rarity' | 'auto',
  rarityBoost: number = 0
): Item | null {
  // Unique items, set items, and alkahest shards should never be upgraded
  if (item.isUnique || item.setId || item.name === 'Alkahest Shard') {
    return null
  }

  // Auto mode: try material first, then rarity
  if (upgradeType === 'auto') {
    const materialUpgrade = upgradeItem(item, depth, 'material', rarityBoost)
    if (materialUpgrade) return materialUpgrade
    return upgradeItem(item, depth, 'rarity', rarityBoost)
  }

  // Step 1: Find current material in data files (if present)
  const currentMaterialId = extractMaterialId(item.name)
  const currentMaterial = currentMaterialId ? getMaterialById(currentMaterialId) : null

  // Step 2: Find base item in data files
  let baseTemplate = item.baseTemplateId ? getBaseById(item.baseTemplateId) : null
  if (!baseTemplate) {
    baseTemplate = findBaseFromItemName(item.name, item.type)
  }
  if (!baseTemplate) return null

  // Step 3: Find which baseName variant is used (from bases data)
  // Extract the name without material prefix
  const nameWithoutMaterial = extractBaseName(item.name)
  let baseName = baseTemplate.baseNames?.[0] || 'Item'
  if (baseTemplate.baseNames) {
    // Find exact match first, then try partial match
    const exactMatch = baseTemplate.baseNames.find(bn => 
      bn.toLowerCase() === nameWithoutMaterial.toLowerCase()
    )
    if (exactMatch) {
      baseName = exactMatch
    } else {
      // If no exact match, find which baseName the item name contains
      const partialMatch = baseTemplate.baseNames.find(bn => 
        nameWithoutMaterial.toLowerCase().includes(bn.toLowerCase())
      )
      if (partialMatch) {
        baseName = partialMatch
      }
    }
  }

  // Step 4: Get current rarity from item data
  const currentRarity = item.rarity

  // Material upgrade
  if (upgradeType === 'material') {
    if (!currentMaterial) return null

    // Find next material in materials data
    const nextMaterial = getNextMaterial(currentMaterialId!)
    if (!nextMaterial) return null

    // Calculate multiplier ratio and apply to stats
    const statMultiplier = nextMaterial.statMultiplier / currentMaterial.statMultiplier
    const upgradedStats: Partial<Omit<Stats, 'hp'>> = {}
    for (const [statKey, value] of Object.entries(item.stats)) {
      if (typeof value === 'number') {
        upgradedStats[statKey as keyof typeof upgradedStats] = Math.floor(value * statMultiplier)
      }
    }
    
    // Construct name from found data: nextMaterial.prefix + baseName (from bases data)
    // Get the appropriate icon for this baseName if available
    let icon = baseTemplate.icon
    if ('baseNameIcons' in baseTemplate && baseTemplate.baseNameIcons && baseName) {
      const specificIcon = baseTemplate.baseNameIcons[baseName]
      if (specificIcon) {
        icon = specificIcon
      }
    }
    
    // Generate proper description combining base and material
    const description = nextMaterial.description
      ? `${baseTemplate.description} - ${nextMaterial.description}`
      : baseTemplate.description
    
    return {
      ...item,
      id: uuidv4(),
      name: `${nextMaterial.prefix} ${baseName}`,
      description,
      icon,
      materialId: nextMaterial.id,
      stats: upgradedStats,
      value: Math.floor(item.value * (nextMaterial.valueMultiplier / currentMaterial.valueMultiplier))
    }
  }

  // Rarity upgrade
  if (upgradeType === 'rarity') {
    const nextRarity = getNextRarity(currentRarity)
    if (!nextRarity) return null

    const currentRarityConfig = getRarityConfig(currentRarity)
    const nextRarityConfig = getRarityConfig(nextRarity)
    
    // Calculate multiplier ratio and apply to stats
    const statMultiplier = nextRarityConfig.statMultiplierBase / currentRarityConfig.statMultiplierBase
    const upgradedStats: Partial<Omit<Stats, 'hp'>> = {}
    for (const [statKey, value] of Object.entries(item.stats)) {
      if (typeof value === 'number') {
        upgradedStats[statKey as keyof typeof upgradedStats] = Math.floor(value * statMultiplier)
      }
    }

    // Construct name from found data: currentMaterial.prefix (if exists) + baseName (from bases data)
    const upgradedName = currentMaterial ? `${currentMaterial.prefix} ${baseName}` : baseName
    
    // Get the appropriate icon for this baseName if available
    let icon = baseTemplate.icon
    if ('baseNameIcons' in baseTemplate && baseTemplate.baseNameIcons && baseName) {
      const specificIcon = baseTemplate.baseNameIcons[baseName]
      if (specificIcon) {
        icon = specificIcon
      }
    }
    
    // Generate proper description combining base and material
    const description = currentMaterial && currentMaterial.description
      ? `${baseTemplate.description} - ${currentMaterial.description}`
      : baseTemplate.description

    return {
      ...item,
      id: uuidv4(),
      name: upgradedName,
      description,
      icon,
      rarity: nextRarity,
      stats: upgradedStats,
      value: Math.floor(item.value * statMultiplier)
    }
  }

  return null
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
  return upgradeItem(item, depth, 'material')
}

/**
 * Upgrade ONLY the item's rarity tier (not material)
 * Returns a new item with higher rarity
 * Returns null if rarity cannot be upgraded
 */
export function upgradeItemRarityOnly(
  item: Item,
  depth: number,
  rarityBoost: number = 0
): Item | null {
  return upgradeItem(item, depth, 'rarity', rarityBoost)
}

/**
 * Upgrade an item by first upgrading material (keeping the same base), 
 * or if material is maxed, upgrade rarity (auto mode)
 * Returns a new item of the same type but better material or higher rarity
 * Unique items cannot be upgraded and will return null
 */
export function upgradeItemRarity(
  item: Item,
  depth: number,
  rarityBoost: number = 0
): Item | null {
  return upgradeItem(item, depth, 'auto', rarityBoost)
}

/**
 * Get the rarity index for comparison
 */
export function getRarityIndex(rarity: ItemRarity): number {
  return RARITY_ORDER.indexOf(rarity)
}
