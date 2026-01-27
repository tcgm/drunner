import type { Item, ItemSlot, ItemRarity } from '@/types'
import { v4 as uuidv4 } from 'uuid'
import { getRandomBase, getCompatibleBase, allBases } from '@data/items/bases'
import { getRandomMaterial, getCompatibleMaterial, getMaterialsByRarity, getMaterialById, allMaterials } from '@data/items/materials'
import { getRandomUnique, ALL_UNIQUE_ITEMS } from '@data/items/uniques'
import { getRandomSetItem, ALL_SET_ITEMS } from '@data/items/sets'
import { applyModifiers, getModifierById } from '@data/items/mods'
import { GiCrystalShine } from 'react-icons/gi'
import { GAME_CONFIG } from '@/config/gameConfig'

/**
 * Loot generation configuration
 */
const LOOT_CONFIG = {
  // Base rarity weights (will be modified by depth)
  baseRarityWeights: {
    junk: 15,
    common: 40,
    uncommon: 25,
    rare: 12,
    epic: 5,
    legendary: 2.5,
    mythic: 0.5,
    artifact: 0,  // Stretch goal - not yet implemented
    set: 0,       // Handled separately
  },

  // Item type weights (what kind of item to generate)
  itemTypeWeights: {
    weapon: 20,
    armor: 20,
    helmet: 15,
    boots: 15,
    accessory1: 15,
    accessory2: 15,
  },

  // Chance for a unique item instead of procedural (by rarity)
  uniqueChance: GAME_CONFIG.loot.uniqueChances,

  // Chance for set items (independent roll, very rare)
  setChance: GAME_CONFIG.loot.setChance,
}

/**
 * Adjust rarity weights based on dungeon depth
 */
function getDepthAdjustedWeights(depth: number): Record<ItemRarity, number> {
  const weights = { ...LOOT_CONFIG.baseRarityWeights }

  if (depth <= 5) {
    // Early floors: mostly junk and common
    weights.junk = 40
    weights.common = 40
    weights.uncommon = 20
    weights.rare = 0
    weights.epic = 0
    weights.legendary = 0
    weights.mythic = 0
    weights.artifact = 0
    weights.cursed = 0
    weights.set = 0
  } else if (depth <= 10) {
    // Early-mid floors
    weights.junk = 20
    weights.common = 40
    weights.uncommon = 30
    weights.rare = 10
    weights.epic = 0
    weights.legendary = 0
    weights.mythic = 0
    weights.artifact = 0
    weights.cursed = 0
    weights.set = 0
  } else if (depth <= 20) {
    // Mid floors
    weights.junk = 5
    weights.common = 25
    weights.uncommon = 40
    weights.rare = 20
    weights.epic = 8
    weights.legendary = 2
    weights.mythic = 0
    weights.artifact = 0
    weights.cursed = 0
    weights.set = 0
  } else {
    // Deep floors: shift toward higher rarities
    weights.junk = 0
    weights.common = 10
    weights.uncommon = 20
    weights.rare = 30
    weights.epic = 25
    weights.legendary = 12
    weights.mythic = 3
    weights.artifact = 0
    weights.cursed = 0
    weights.set = 0
  }

  return weights
}

/**
 * Select a random rarity based on weights
 */
function selectRarity(depth: number, minRarity?: ItemRarity, maxRarity?: ItemRarity): ItemRarity {
  const weights = getDepthAdjustedWeights(depth)
  
  // Filter weights based on min/max constraints
  const rarityOrder: ItemRarity[] = ['junk', 'common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic', 'artifact', 'set']
  const minIndex = minRarity ? rarityOrder.indexOf(minRarity) : 0
  const maxIndex = maxRarity ? rarityOrder.indexOf(maxRarity) : rarityOrder.length - 1
  
  const filteredWeights: Record<string, number> = {}
  for (const [rarity, weight] of Object.entries(weights)) {
    const rarityIndex = rarityOrder.indexOf(rarity as ItemRarity)
    if (rarityIndex >= minIndex && rarityIndex <= maxIndex) {
      filteredWeights[rarity] = weight
    }
  }
  
  // If no valid weights after filtering, return minRarity or common
  const total = Object.values(filteredWeights).reduce((sum, w) => sum + w, 0)
  if (total === 0) {
    return minRarity || 'common'
  }
  
  let roll = Math.random() * total
  for (const [rarity, weight] of Object.entries(filteredWeights)) {
    roll -= weight
    if (roll <= 0) {
      return rarity as ItemRarity
    }
  }

  return minRarity || 'common' // Fallback
}

/**
 * Select a random item type based on weights
 */
function selectItemType(): ItemSlot {
  const weights = LOOT_CONFIG.itemTypeWeights
  const total = Object.values(weights).reduce((sum, w) => sum + w, 0)
  let roll = Math.random() * total

  for (const [type, weight] of Object.entries(weights)) {
    roll -= weight
    if (roll <= 0) {
      return type as ItemSlot
    }
  }

  return 'weapon' // Fallback
}

/**
 * Apply material modifiers to base item stats
 */
function applyMaterialToStats(
  baseStats: Partial<Record<string, number>>,
  multiplier: number
): Partial<Record<string, number>> {
  const modifiedStats: Partial<Record<string, number>> = {}
  
  for (const [key, value] of Object.entries(baseStats)) {
    if (value !== undefined) {
      modifiedStats[key] = Math.floor(value * multiplier)
    }
  }
  
  return modifiedStats
}

/**
 * Generate item name from material and base template
 */
function generateItemName(materialPrefix: string, baseTemplate: Omit<Item, 'id' | 'name' | 'rarity' | 'value'>): string {
  // Extract base name from description or use type mapping
  const description = (baseTemplate.description || '').toLowerCase()
  
  // If description is empty, use type fallback immediately
  if (!description) {
    const typeNames: Record<string, string> = {
      weapon: 'Weapon',
      armor: 'Armor',
      helmet: 'Helmet',
      boots: 'Boots',
      accessory1: 'Ring',
      accessory2: 'Amulet',
    }
    return `${materialPrefix} ${typeNames[baseTemplate.type] || 'Item'}`
  }
  
  // Map keywords to base names - check more specific terms first
  // Check for compound/specific terms before generic ones to avoid false matches
  
  // Armor - check before accessories since "metal rings" contains "ring"
  if (description.includes('plate') || description.includes('plating')) return `${materialPrefix} Plate Armor`
  if (description.includes('chainmail') || description.includes('chain mail') || description.includes('interlocking') || description.includes('metal rings')) return `${materialPrefix} Chainmail`
  if (description.includes('robe') || description.includes('vestment')) return `${materialPrefix} Robe`
  if (description.includes('vest') || description.includes('garment')) return `${materialPrefix} Vest`
  
  // Weapons
  if (description.includes('sword') || description.includes('blade')) return `${materialPrefix} Sword`
  if (description.includes('axe') || description.includes('chopping')) return `${materialPrefix} Axe`
  if (description.includes('dagger') || description.includes('stabbing') || description.includes('quick')) return `${materialPrefix} Dagger`
  if (description.includes('staff') || description.includes('mystical') || description.includes('channeling')) return `${materialPrefix} Staff`
  if (description.includes('bow') || description.includes('ranged') || description.includes('distance')) return `${materialPrefix} Bow`
  if (description.includes('mace') || description.includes('bludgeon') || description.includes('crushing')) return `${materialPrefix} Mace`
  
  // Helmets
  if (description.includes('crown') || description.includes('regal')) return `${materialPrefix} Crown`
  if (description.includes('hood') && !description.includes('helmet')) return `${materialPrefix} Hood`
  if (description.includes('helmet') || description.includes('headgear') || description.includes('head')) return `${materialPrefix} Helmet`
  
  // Boots
  if (description.includes('greaves') || description.includes('leg protection') || description.includes('leg armor')) return `${materialPrefix} Greaves`
  if (description.includes('sandals') || description.includes('open footwear')) return `${materialPrefix} Sandals`
  if (description.includes('boots') || description.includes('footwear')) return `${materialPrefix} Boots`
  
  // Accessories - check last since "ring" is a common substring
  if (description.includes('ring') && !description.includes('rings')) return `${materialPrefix} Ring` // Avoid matching "metal rings"
  if (description.includes('amulet') || description.includes('necklace')) return `${materialPrefix} Amulet`
  if (description.includes('charm')) return `${materialPrefix} Charm`
  if (description.includes('talisman')) return `${materialPrefix} Talisman`
  
  // Fallback: use type
  const typeNames: Record<string, string> = {
    weapon: 'Weapon',
    armor: 'Armor',
    helmet: 'Helmet',
    boots: 'Boots',
    accessory1: 'Ring',
    accessory2: 'Amulet',
  }
  
  return `${materialPrefix} ${typeNames[baseTemplate.type] || 'Item'}`
}

/**
 * Generate a random item by combining material + base template, unique item, or set item
 */
export function generateItem(
  depth: number, 
  forceType?: ItemSlot,
  minRarity?: ItemRarity,
  maxRarity?: ItemRarity,
  rarityBoost: number = 0,
  forceMaterial?: string | Material,
  modifiers: string[] = []
): Item {
  const adjustedDepth = depth + rarityBoost
  const rarity = selectRarity(adjustedDepth, minRarity, maxRarity)
  const type = forceType || selectItemType()
  
  // Check if we should generate a set item (independent of rarity)
  if (depth >= 15 && Math.random() < LOOT_CONFIG.setChance) {
    const setTemplate = getRandomSetItem()
    if (setTemplate) {
      // If we have a forced type, only use set item if it matches appropriately
      if (!forceType || 
          setTemplate.type === forceType || 
          (forceType === 'accessory1' && setTemplate.type === 'accessory') ||
          (forceType === 'accessory2' && setTemplate.type === 'accessory')) {
        return {
          ...setTemplate,
          id: uuidv4(),
          type: forceType || setTemplate.type, // Use forced type for specific accessory slots
          setId: 'kitsune', // Mark as set item
        }
      }
    }
  }
  
  // Check if we should generate a unique item
  const uniqueChances: Record<string, number> = LOOT_CONFIG.uniqueChance
  if (rarity in uniqueChances && Math.random() < uniqueChances[rarity]) {
    const uniqueTemplate = getRandomUnique(rarity)
    if (uniqueTemplate) {
      // Generate unique item with proper type matching if possible
      if (!forceType || 
          uniqueTemplate.type === forceType ||
          (forceType === 'accessory1' && uniqueTemplate.type === 'accessory') ||
          (forceType === 'accessory2' && uniqueTemplate.type === 'accessory')) {
        return {
          ...uniqueTemplate,
          id: uuidv4(),
          type: forceType || uniqueTemplate.type, // Use forced type for specific accessory slots
          isUnique: true, // Mark as unique item
        }
      }
      // If forced type doesn't match unique, generate procedural item instead
    }
  }
  
  // Generate procedural item from material + base
  // Strategy: Keep trying until we find a compatible combination
  let material = forceMaterial 
    ? (typeof forceMaterial === 'string' ? getMaterialById(forceMaterial) : forceMaterial)
    : getCompatibleMaterial(rarity, type)
  let baseTemplate = getCompatibleBase(type, material.id)
  
  // Retry up to 10 times if we can't find a compatible combination
  let attempts = 0
  const maxAttempts = 10
  
  while (!baseTemplate && attempts < maxAttempts) {
    material = getCompatibleMaterial(rarity, type)
    baseTemplate = getCompatibleBase(type, material.id)
    attempts++
  }
  
  // If we still failed after retries, give alkahest instead
  if (!baseTemplate) {
    console.warn(`Failed to generate compatible item for type ${type} with rarity ${rarity} after ${maxAttempts} attempts - giving alkahest`)
    // Create an alkahest shard item that represents raw crafting material
    const alkahestValue = Math.floor(GAME_CONFIG.loot.baseItemValue * (material?.valueMultiplier || 1))
    return {
      id: uuidv4(),
      name: 'Alkahest Shard',
      description: 'A crystallized essence of incompatible materials. Can be used for crafting.',
      type: type, // Keep requested type so it doesn't break inventory logic
      rarity,
      stats: {}, // No stats - just crafting material
      value: alkahestValue,
      icon: GiCrystalShine,
    }
  }
  
  // Generate the item from the base and material
  const base: Omit<Item, 'id' | 'name' | 'rarity' | 'value'> = baseTemplate
  
  // Apply material multiplier to base stats
  const modifiedStats = applyMaterialToStats(base.stats, material.statMultiplier)
  
  // Calculate value
  const baseValue = 50
  const value = Math.floor(baseValue * material.valueMultiplier)
  
  // Combine descriptions
  const description = material.description 
    ? `${base.description} - ${material.description}`
    : base.description
  
  // Generate item name - if we can't generate a proper name, try to repair it first
  const name = generateItemName(material.prefix, base)
  
  // Check if name generation failed (returned generic fallback - material + single type word only)
  // Only "Weapon", "Armor", and "Item" are pure fallbacks; others like "Helmet"/"Boots" are valid keyword matches
  const nameParts = name.split(' ')
  const isGeneric = nameParts.length === 2 && 
    (name.endsWith(' Item') || name.endsWith(' Weapon') || name.endsWith(' Armor'))
  
  if (isGeneric) {
    console.warn(`Generated generic name "${name}" for ${material.prefix} + ${base.description} - attempting repair`)
    
    // Create a temporary item to attempt repair
    const tempItem: Item = {
      id: uuidv4(),
      name,
      description: material.description 
        ? `${base.description} - ${material.description}`
        : base.description,
      type: forceType || base.type,
      rarity,
      stats: applyMaterialToStats(base.stats, material.statMultiplier),
      value: Math.floor(GAME_CONFIG.loot.baseItemValue * material.valueMultiplier),
      icon: base.icon,
      materialId: material.id,
      baseTemplateId: baseTemplate ? `${base.type}_${base.description.split(' ')[0].toLowerCase()}` : undefined,
      isUnique: false,
    }
    
    // Try to repair the item (name and icon)
    let repairedItem = repairItemName(tempItem)
    repairedItem = repairItemIcon(repairedItem)
    
    // If repair succeeded (name changed), return the repaired item
    if (repairedItem.name !== name) {
      console.log(`Successfully repaired: "${name}" -> "${repairedItem.name}"`)
      return repairedItem
    }
    
    // Repair failed - give alkahest instead
    console.warn(`Repair failed for "${name}" - giving alkahest`)
    const alkahestValue = Math.floor(GAME_CONFIG.loot.baseItemValue * material.valueMultiplier)
    return {
      id: uuidv4(),
      name: 'Alkahest Shard',
      description: 'A crystallized essence that failed to form properly. Can be used for crafting.',
      type: forceType || base.type,
      rarity,
      stats: {},
      value: alkahestValue,
      icon: GiCrystalShine,
      isUnique: false,
    }
  }
  
  // Create final item with metadata for repair
  const item: Item = {
    id: uuidv4(),
    name,
    description: description,
    type: forceType || base.type,
    rarity,
    stats: modifiedStats,
    value,
    icon: base.icon,
    materialId: material.id,
    baseTemplateId: baseTemplate ? `${base.type}_${base.description.split(' ')[0].toLowerCase()}` : undefined,
    isUnique: false, // Procedurally generated item
    modifiers: modifiers.length > 0 ? modifiers : undefined,
  }
  
  // Apply modifiers if any
  if (modifiers.length > 0) {
    const modifierObjects = modifiers.map(id => getModifierById(id)).filter(Boolean)
    const modifiedItem = applyModifiers(item, modifierObjects)
    
    // Update description with modifier info
    const modifierNames = modifierObjects.map(m => m.name).join(', ')
    modifiedItem.description = `${modifierNames}! ${modifiedItem.description}`
    
    return modifiedItem
  }
  
  return item
}

/**
 * Generate multiple items (for treasure events)
 */
export function generateItems(count: number, depth: number): Item[] {
  return Array.from({ length: count }, () => generateItem(depth))
}

/**
 * Repair an item's name if it has a generic name
 * This is used to fix items loaded from old saves that may have incorrect names
 * Attempts to extract material from name and base from description
 */
export function repairItemName(item: Item): Item {
  // Skip if item is unique/set or already has a proper name
  if (item.isUnique) {
    return item
  }
  
  // Check if the name is generic (material + single type word only)
  // Only "Weapon", "Armor", and "Item" are pure fallbacks; others like "Helmet"/"Boots" are valid keyword matches
  const nameParts = item.name.split(' ')
  const hasGenericName = nameParts.length === 2 && 
    (item.name.endsWith(' Weapon') || item.name.endsWith(' Armor') || item.name.endsWith(' Item'))
  
  if (!hasGenericName) {
    return item // Name seems fine
  }
  
  let material = null
  
  // Try to get material from metadata
  if (item.materialId) {
    material = getMaterialById(item.materialId)
  }
  
  // If no metadata, try to extract material name from item name
  if (!material) {
    const nameParts = item.name.split(' ')
    const potentialMaterialName = nameParts[0] // First word (e.g., "Mithril" from "Mithril Weapon")
    
    // Search for material by prefix
    material = allMaterials.find(m => 
      m.prefix.toLowerCase() === potentialMaterialName.toLowerCase()
    )
  }
  
  if (!material) {
    return item
  }
  
  // Extract base description (before the material suffix)
  const baseDescription = item.description.split(' - ')[0] || item.description
  
  // Try to find matching base template by description
  const matchingBase = allBases.find(base => 
    base.description === baseDescription && base.type === item.type
  )
  
  if (!matchingBase) {
    return item
  }
  
  // Generate proper name
  const newName = generateItemName(material.prefix, matchingBase)
  
  return {
    ...item,
    name: newName,
    icon: matchingBase.icon, // Restore proper icon
    materialId: material.id, // Save metadata for future
  }
}

/**
 * Repair an item's icon if it's using the default bar icon
 */
export function repairItemIcon(item: Item): Item {
  // Skip if item already has an icon
  if (item.icon && typeof item.icon === 'function') return item
  
  // Check for set items FIRST (by rarity or setId)
  // This handles old saves where set items were mistakenly marked as isUnique
  if (item.setId || item.rarity === 'set') {
    const setItem = ALL_SET_ITEMS.find(s => s.name === item.name)
    if (setItem?.icon) {
      return {
        ...item,
        icon: setItem.icon,
      }
    }
    console.warn(`Could not find set item icon for: ${item.name} (set: ${item.setId})`)
    return item
  }
  
  // For unique items, look up by name in the unique items catalog
  if (item.isUnique) {
    const uniqueItem = ALL_UNIQUE_ITEMS.find(u => u.name === item.name)
    if (uniqueItem?.icon) {
      return {
        ...item,
        icon: uniqueItem.icon,
      }
    }
    console.warn(`Could not find unique item icon for: ${item.name}`)
    return item
  }
  
  // Try to find ANY unique/set item by name as a fallback
  // (for items that lost their isUnique flag)
  const uniqueMatch = ALL_UNIQUE_ITEMS.find(u => u.name === item.name)
  if (uniqueMatch?.icon) {
    return {
      ...item,
      icon: uniqueMatch.icon,
      isUnique: true, // Fix the flag while we're at it
    }
  }
  
  const setMatch = ALL_SET_ITEMS.find(s => s.name === item.name)
  if (setMatch?.icon) {
    return {
      ...item,
      icon: setMatch.icon,
      setId: 'kitsune', // Fix the flag while we're at it
    }
  }
  
  // Check if using default icon (GiIronBar or undefined)
  const hasDefaultIcon = !item.icon || item.icon === 'GiIronBar'
  
  if (!hasDefaultIcon) {
    return item // Icon looks fine
  }
  
  // Extract base description (before the material suffix)
  const baseDescription = item.description.split(' - ')[0] || item.description
  
  // Try to find matching base template by description
  const matchingBase = allBases.find(base => 
    base.description === baseDescription && base.type === item.type
  )
  
  if (!matchingBase || !matchingBase.icon) {
    return item
  }
  
  return {
    ...item,
    icon: matchingBase.icon,
  }
}

/**
 * Repair multiple items at once
 */
export function repairItemNames(items: Item[]): Item[] {
  // First repair names, then repair icons
  return items.map(repairItemName).map(repairItemIcon)
}
