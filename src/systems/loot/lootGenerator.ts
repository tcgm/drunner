import type { Item, ItemSlot, ItemRarity, Material, BaseTemplate } from '@/types'
import type { ItemStorage, UniqueItemV3, SetItemV3, ProceduralItemV3 } from '@/types/items-v3'
import type { IconType } from 'react-icons'
import { v4 as uuidv4 } from 'uuid'
import { getRandomBase, getCompatibleBase, allBases } from '@data/items/bases'
import { getRandomMaterial, getCompatibleMaterial, getMaterialsByRarity, getMaterialById, allMaterials } from '@data/items/materials'
import { getRandomUnique, ALL_UNIQUE_ITEMS } from '@data/items/uniques'
import { getRandomSetItem, ALL_SET_ITEMS, getSetIdFromItemName } from '@data/items/sets'
import { applyModifiers, getModifierById } from '@data/items/mods'
import { hydrateItem } from '@/utils/itemHydration'
import { GiCrystalShine } from 'react-icons/gi'
import { GAME_CONFIG } from '@/config/gameConfig'
import { getRarityConfig, RARITY_CONFIGS } from '@/systems/rarity/raritySystem'
import { CURRENT_STAT_VERSION } from '@/utils/itemMigration'

/**
 * Get all rarities ordered by their minFloor (progression order)
 */
function getRarityOrder(): ItemRarity[] {
  return Object.entries(RARITY_CONFIGS)
    .sort(([, a], [, b]) => a.minFloor - b.minFloor)
    .map(([rarity]) => rarity as ItemRarity)
}

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
  
  // Chance for set items to roll as unique (enhanced stats)
  setUniqueChance: 0.15, // 15% chance for set items to have boosted stats
  setUniqueBoost: 1.3, // 30% stat boost when set item rolls as unique
}

/**
 * Adjust rarity weights based on dungeon depth
 */
function getDepthAdjustedWeights(depth: number): Partial<Record<ItemRarity, number>> {
  const weights: Partial<Record<ItemRarity, number>> = { ...LOOT_CONFIG.baseRarityWeights }

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
  }

  return weights
}

/**
 * Select a random rarity based on weights
 */
function selectRarity(depth: number, minRarity?: ItemRarity, maxRarity?: ItemRarity): ItemRarity {
  const weights = getDepthAdjustedWeights(depth)
  
  // Get rarity order dynamically from the rarity system (sorted by minFloor)
  const rarityOrder = getRarityOrder()
  const minIndex = minRarity ? rarityOrder.indexOf(minRarity) : 0
  const maxIndex = maxRarity ? rarityOrder.indexOf(maxRarity) : rarityOrder.length - 1
  
  // If min/max rarities are specified but not in weights, use them directly
  if (minRarity && maxRarity && minIndex >= 0 && maxIndex >= 0) {
    // For high-tier rarities not in the weight table, pick randomly from the range
    const validRarities = rarityOrder.slice(minIndex, maxIndex + 1)
    return validRarities[Math.floor(Math.random() * validRarities.length)]
  }
  
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
 * Apply material and rarity modifiers to base item stats
 */
function applyMaterialToStats(
  baseStats: Partial<Record<string, number>>,
  materialMultiplier: number,
  rarityMultiplier: number
): Partial<Record<string, number>> {
  const modifiedStats: Partial<Record<string, number>> = {}
  
  for (const [key, value] of Object.entries(baseStats)) {
    if (value !== undefined) {
      // Apply both material and rarity multipliers: base × material × rarity
      modifiedStats[key] = Math.floor(value * materialMultiplier * rarityMultiplier)
    }
  }
  
  return modifiedStats
}

/**
 * Generate a meaningful baseTemplateId from a base template
 * Format: "type_keyword" (e.g., "weapon_sword", "weapon_instrument")
 */
function generateBaseTemplateId(base: Omit<Item, 'id' | 'name' | 'rarity' | 'value'>): string {
  const description = base.description.toLowerCase()
  
  // Define keywords to search for in descriptions (order matters - more specific first)
  const keywords: Record<string, string[]> = {
    // Weapons
    'sword': ['sword', 'blade'],
    'axe': ['axe', 'chopping'],
    'dagger': ['dagger', 'stabbing'],
    'bow': ['bow', 'ranged'],
    'mace': ['mace', 'bludgeon'],
    'staff': ['staff', 'channeling'],
    'instrument': ['instrument', 'melodious', 'music'],
    // Armor
    'plate': ['plate', 'plating'],
    'chainmail': ['chainmail', 'chain mail', 'interlocking'],
    'robe': ['robe', 'vestment'],
    'vest': ['vest', 'garment'],
    // Helmets
    'crown': ['crown', 'regal'],
    'hood': ['hood'],
    'helmet': ['helmet', 'headgear'],
    // Boots
    'greaves': ['greaves', 'leg protection'],
    'sandals': ['sandals'],
    'boots': ['boots', 'footwear'],
    // Accessories
    'ring': ['ring'],
    'amulet': ['amulet', 'necklace'],
    'charm': ['charm'],
    'talisman': ['talisman'],
  }
  
  // Try to find a matching keyword in the description
  for (const [keyword, patterns] of Object.entries(keywords)) {
    for (const pattern of patterns) {
      if (description.includes(pattern)) {
        return `${base.type}_${keyword}`
      }
    }
  }
  
  // If we have baseNames, use the first one
  if ('baseNames' in base && Array.isArray(base.baseNames) && base.baseNames.length > 0) {
    return `${base.type}_${base.baseNames[0].toLowerCase()}`
  }
  
  // Fallback: extract first meaningful word (skip articles)
  const words = description.split(' ')
  const articles = ['a', 'an', 'the']
  const meaningfulWord = words.find(w => !articles.includes(w.toLowerCase())) || words[0]
  
  return `${base.type}_${meaningfulWord.toLowerCase()}`
}

/**
 * Generate item name from material and base template
 * Returns both the name and the appropriate icon for that specific baseName
 */
function generateItemName(materialPrefix: string, baseTemplate: Omit<Item, 'id' | 'name' | 'rarity' | 'value'>): { name: string; icon?: IconType } {
  // If base template has explicit baseNames, randomly pick one
  if ('baseNames' in baseTemplate && Array.isArray(baseTemplate.baseNames) && baseTemplate.baseNames.length > 0) {
    const randomName = baseTemplate.baseNames[Math.floor(Math.random() * baseTemplate.baseNames.length)]
    const name = `${materialPrefix} ${randomName}`
    
    // Check if there's a specific icon for this baseName
    let icon = baseTemplate.icon
    if ('baseNameIcons' in baseTemplate && baseTemplate.baseNameIcons && typeof baseTemplate.baseNameIcons === 'object') {
      const specificIcon = (baseTemplate.baseNameIcons as Record<string, IconType>)[randomName]
      if (specificIcon) {
        icon = specificIcon
      }
    }
    
    return { name, icon }
  }
  
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
    return { name: `${materialPrefix} ${typeNames[baseTemplate.type] || 'Item'}`, icon: baseTemplate.icon }
  }
  
  // Map keywords to base names - check more specific terms first
  // Check for compound/specific terms before generic ones to avoid false matches
  
  // Armor - check before accessories since "metal rings" contains "ring"
  if (description.includes('plate') || description.includes('plating')) return { name: `${materialPrefix} Plate Armor`, icon: baseTemplate.icon }
  if (description.includes('chainmail') || description.includes('chain mail') || description.includes('interlocking') || description.includes('metal rings')) return { name: `${materialPrefix} Chainmail`, icon: baseTemplate.icon }
  if (description.includes('robe') || description.includes('vestment')) return { name: `${materialPrefix} Robe`, icon: baseTemplate.icon }
  if (description.includes('vest') || description.includes('garment')) return { name: `${materialPrefix} Vest`, icon: baseTemplate.icon }
  
  // Weapons
  if (description.includes('sword') || description.includes('blade')) return { name: `${materialPrefix} Sword`, icon: baseTemplate.icon }
  if (description.includes('axe') || description.includes('chopping')) return { name: `${materialPrefix} Axe`, icon: baseTemplate.icon }
  if (description.includes('dagger') || description.includes('stabbing') || description.includes('quick')) return { name: `${materialPrefix} Dagger`, icon: baseTemplate.icon }
  if (description.includes('bow') || description.includes('ranged') || description.includes('distance')) return { name: `${materialPrefix} Bow`, icon: baseTemplate.icon }
  if (description.includes('mace') || description.includes('bludgeon') || description.includes('crushing')) return { name: `${materialPrefix} Mace`, icon: baseTemplate.icon }
  
  // Helmets
  if (description.includes('crown') || description.includes('regal')) return { name: `${materialPrefix} Crown`, icon: baseTemplate.icon }
  if (description.includes('hood') && !description.includes('helmet')) return { name: `${materialPrefix} Hood`, icon: baseTemplate.icon }
  if (description.includes('helmet') || description.includes('headgear') || description.includes('head')) return { name: `${materialPrefix} Helmet`, icon: baseTemplate.icon }
  
  // Boots
  if (description.includes('greaves') || description.includes('leg protection') || description.includes('leg armor')) return { name: `${materialPrefix} Greaves`, icon: baseTemplate.icon }
  if (description.includes('sandals') || description.includes('open footwear')) return { name: `${materialPrefix} Sandals`, icon: baseTemplate.icon }
  if (description.includes('boots') || description.includes('footwear')) return { name: `${materialPrefix} Boots`, icon: baseTemplate.icon }
  
  // Accessories - check before weapons since "mystical" appears in both talisman and staff
  if (description.includes('ring') && !description.includes('rings')) return { name: `${materialPrefix} Ring`, icon: baseTemplate.icon } // Avoid matching "metal rings"
  if (description.includes('amulet') || description.includes('necklace')) return { name: `${materialPrefix} Amulet`, icon: baseTemplate.icon }
  if (description.includes('charm')) return { name: `${materialPrefix} Charm`, icon: baseTemplate.icon }
  if (description.includes('talisman')) return { name: `${materialPrefix} Talisman`, icon: baseTemplate.icon }
  
  // Staff weapon - check after talisman to avoid matching "mystical talisman"
  if (description.includes('staff') || (description.includes('channeling') && description.includes('weapon'))) return { name: `${materialPrefix} Staff`, icon: baseTemplate.icon }
  
  // Fallback: use type
  const typeNames: Record<string, string> = {
    weapon: 'Weapon',
    armor: 'Armor',
    helmet: 'Helmet',
    boots: 'Boots',
    accessory1: 'Ring',
    accessory2: 'Amulet',
  }
  
  return { name: `${materialPrefix} ${typeNames[baseTemplate.type] || 'Item'}`, icon: baseTemplate.icon }
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
  forceMaterialOrBase?: string | Material | BaseTemplate,
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
          ((forceType === 'accessory1' || forceType === 'accessory2') && (setTemplate.type === 'accessory1' || setTemplate.type === 'accessory2'))) {
        
        // Generate V3 set item
        const templateId = setTemplate.name.toUpperCase().replace(/['\s]/g, '_')
        const rollAsUnique = Math.random() < LOOT_CONFIG.setUniqueChance
        
        const v3Item: SetItemV3 = {
          version: 3,
          id: uuidv4(),
          itemType: 'set',
          templateId,
          isUniqueRoll: rollAsUnique,
          modifiers: modifiers.length > 0 ? modifiers : undefined
        }
        
        // Hydrate and return
        return hydrateItem(v3Item)
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
          ((forceType === 'accessory1' || forceType === 'accessory2') && (uniqueTemplate.type === 'accessory1' || uniqueTemplate.type === 'accessory2'))) {
        
        // Generate V3 unique item
        const templateId = uniqueTemplate.name.toUpperCase().replace(/['\s]/g, '_')
        
        const v3Item: UniqueItemV3 = {
          version: 3,
          id: uuidv4(),
          itemType: 'unique',
          templateId,
          modifiers: modifiers.length > 0 ? modifiers : undefined
        }
        
        // Hydrate and return
        return hydrateItem(v3Item)
      }
      // If forced type doesn't match unique, generate procedural item instead
    }
  }
  
  // Determine if we have a forced base template or material
  let material: Material | undefined
  let baseTemplate: BaseTemplate | undefined

  if (forceMaterialOrBase) {
    // Check if it's a BaseTemplate (has 'description' and 'stats')
    if (typeof forceMaterialOrBase === 'object' && 'description' in forceMaterialOrBase && 'stats' in forceMaterialOrBase) {
      baseTemplate = forceMaterialOrBase as BaseTemplate
      // Get a compatible material for the base's type
      material = getCompatibleMaterial(rarity, baseTemplate.type)
    } else {
      // It's a Material or material ID string
      material = typeof forceMaterialOrBase === 'string'
        ? getMaterialById(forceMaterialOrBase)
        : forceMaterialOrBase
      if (material) {
        baseTemplate = getCompatibleBase(type, material.id)
      }
    }
  } else {
    // Generate procedural item from material + base
    material = getCompatibleMaterial(rarity, type)
    if (material) {
      baseTemplate = getCompatibleBase(type, material.id)
    }
  }
  
  // Retry up to 10 times if we can't find a compatible combination
  let attempts = 0
  const maxAttempts = 10
  
  while ((!baseTemplate || !material) && attempts < maxAttempts) {
    material = getCompatibleMaterial(rarity, type)
    baseTemplate = getCompatibleBase(type, material.id)
    attempts++
  }
  
  // If we still failed after retries, give alkahest instead
  if (!baseTemplate || !material) {
    console.warn(`Failed to generate compatible item for type ${type} with rarity ${rarity} after ${maxAttempts} attempts - giving alkahest`)
    // Create an alkahest shard item that represents raw crafting material
    const alkahestValue = Math.floor(GAME_CONFIG.loot.baseItemValue * ((material?.valueMultiplier) || 1))
    return {
      id: uuidv4(),
      name: 'Alkahest Shard',
      description: 'A crystallized essence of incompatible materials. Can be used for crafting.',
      type: type, // Keep requested type so it doesn't break inventory logic
      rarity,
      stats: {}, // No stats - just crafting material
      value: alkahestValue,
      icon: GiCrystalShine,
      isUnique: false,
    }
  }
  
  // At this point, both baseTemplate and material are guaranteed to be defined
  // Generate V3 procedural item - store only IDs, derive everything at hydration

  // Select random variant from baseNames array if available
  let variantName: string
  if (baseTemplate.baseNames && baseTemplate.baseNames.length > 0) {
    const randomIndex = Math.floor(Math.random() * baseTemplate.baseNames.length)
    variantName = baseTemplate.baseNames[randomIndex]
  } else {
    // Fallback: use first word of description capitalized
    variantName = baseTemplate.description.split(' ')[0]
    variantName = variantName.charAt(0).toUpperCase() + variantName.slice(1)
  }
  
  // Construct baseTemplateId in new dot format: "type.id"
  const baseTemplateId = `${baseTemplate.type}.${baseTemplate.id}`
  
  // Create V3 procedural item
  const v3Item: ProceduralItemV3 = {
    version: 3,
    id: uuidv4(),
    itemType: 'procedural',
    type: baseTemplate.type as 'weapon' | 'armor' | 'helmet' | 'boots' | 'accessory',
    materialId: material.id,
    baseTemplateId,
    variantName,
    rarity,
    modifiers: modifiers.length > 0 ? modifiers : undefined
  }
  
  // Hydrate and return
  return hydrateItem(v3Item)
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
  // First check if the name is corrupted with icon function code
  if (typeof item.name === 'string' && item.name.includes('function ')) {
    console.log(`[Repair] Detected corrupted item name with function code: ${item.name.substring(0, 50)}...`)

    // Try to extract the actual name after the function code
    const match = item.name.match(/}\)\(t\)\s+(.+)/)
    if (match && match[1]) {
      const extractedName = match[1].trim()
      console.log(`[Repair] Extracted name: ${extractedName}`)
      return {
        ...item,
        name: extractedName,
      }
    } else {
      // Couldn't extract name, try to reconstruct from description
      console.log(`[Repair] Could not extract name, attempting reconstruction from description`)
      const typeNames: Record<string, string> = {
        weapon: 'Weapon',
        armor: 'Armor',
        helmet: 'Helmet',
        boots: 'Boots',
        accessory1: 'Accessory',
        accessory2: 'Accessory',
      }
      return {
        ...item,
        name: `Unknown ${typeNames[item.type] || 'Item'}`,
      }
    }
  }

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
    // Handle renamed materials (migration)
    let materialId = item.materialId
    if (materialId === 'void_legendary' || materialId === 'void') {
      materialId = 'voidstone' // Renamed to avoid conflict with void rarity
    }
    material = getMaterialById(materialId)
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
  
  // Generate proper name and icon
  const { name: newName, icon: newIcon } = generateItemName(material.prefix, matchingBase)
  
  return {
    ...item,
    name: newName,
    icon: newIcon || matchingBase.icon, // Use specific icon or fallback to base icon
    materialId: material.id, // Save metadata for future
  }
}

/**
 * Repair an item's icon if it's using the default bar icon
 */
export function repairItemIcon(item: Item): Item {
  // Skip if item already has an icon
  if (item.icon && typeof item.icon === 'function') return item
  
  // Check for set items FIRST (by setId)
  // This handles old saves where set items were mistakenly marked as isUnique
  if (item.setId) {
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
    const setId = getSetIdFromItemName(setMatch.name) || 'unknown'
    return {
      ...item,
      icon: setMatch.icon,
      setId, // Fix the flag while we're at it
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
