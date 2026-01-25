import type { Item, ItemSlot, ItemRarity } from '@/types'
import { v4 as uuidv4 } from 'uuid'
import { getRandomBase } from '@data/items/bases'
import { getRandomMaterial } from '@data/items/materials'
import { getRandomUnique } from '@data/items/uniques'
import { getRandomSetItem } from '@data/items/sets'

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
    cursed: 0,    // Stretch goal - not yet implemented
    set: 0,       // Stretch goal - not yet implemented
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
  uniqueChance: {
    epic: 0.15,      // 15% chance for epic uniques
    legendary: 0.30, // 30% chance for legendary uniques
    mythic: 0.50,    // 50% chance for mythic uniques
  },

  // Chance for set items (independent roll, very rare)
  setChance: 0.05,   // 5% chance for any set item drop
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
function selectRarity(depth: number): ItemRarity {
  const weights = getDepthAdjustedWeights(depth)
  const total = Object.values(weights).reduce((sum, w) => sum + w, 0)
  let roll = Math.random() * total

  for (const [rarity, weight] of Object.entries(weights)) {
    roll -= weight
    if (roll <= 0) {
      return rarity as ItemRarity
    }
  }

  return 'common' // Fallback
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
  const description = baseTemplate.description.toLowerCase()
  
  // Map keywords to base names
  if (description.includes('sword') || description.includes('blade')) return `${materialPrefix} Sword`
  if (description.includes('axe')) return `${materialPrefix} Axe`
  if (description.includes('dagger')) return `${materialPrefix} Dagger`
  if (description.includes('staff') || description.includes('mystical')) return `${materialPrefix} Staff`
  if (description.includes('bow') || description.includes('ranged')) return `${materialPrefix} Bow`
  if (description.includes('mace') || description.includes('bludgeon')) return `${materialPrefix} Mace`
  
  if (description.includes('plate') || description.includes('plating')) return `${materialPrefix} Plate Armor`
  if (description.includes('chainmail') || description.includes('chain')) return `${materialPrefix} Chainmail`
  if (description.includes('vest') || description.includes('garment')) return `${materialPrefix} Vest`
  if (description.includes('robe') || description.includes('vestment')) return `${materialPrefix} Robe`
  
  if (description.includes('helmet') || description.includes('headgear')) return `${materialPrefix} Helmet`
  if (description.includes('hood')) return `${materialPrefix} Hood`
  if (description.includes('crown') || description.includes('regal')) return `${materialPrefix} Crown`
  
  if (description.includes('boots') || description.includes('footwear')) return `${materialPrefix} Boots`
  if (description.includes('greaves') || description.includes('leg protection')) return `${materialPrefix} Greaves`
  if (description.includes('sandals')) return `${materialPrefix} Sandals`
  
  if (description.includes('ring')) return `${materialPrefix} Ring`
  if (description.includes('amulet')) return `${materialPrefix} Amulet`
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
export function generateItem(depth: number): Item {
  const rarity = selectRarity(depth)
  const type = selectItemType()
  
  // Check if we should generate a set item (independent of rarity)
  if (depth >= 15 && Math.random() < LOOT_CONFIG.setChance) {
    const setTemplate = getRandomSetItem()
    if (setTemplate) {
      return {
        ...setTemplate,
        id: uuidv4(),
      }
    }
  }
  
  // Check if we should generate a unique item
  const uniqueChances: Record<string, number> = LOOT_CONFIG.uniqueChance
  if (rarity in uniqueChances && Math.random() < uniqueChances[rarity]) {
    const uniqueTemplate = getRandomUnique(rarity)
    if (uniqueTemplate) {
      // Generate unique item with proper type matching if possible
      if (uniqueTemplate.type === type || 
          (type === 'accessory1' && (uniqueTemplate.type === 'accessory1' || uniqueTemplate.type === 'accessory2')) ||
          (type === 'accessory2' && (uniqueTemplate.type === 'accessory1' || uniqueTemplate.type === 'accessory2'))) {
        return {
          ...uniqueTemplate,
          id: uuidv4(),
          type, // Use the selected type (for accessory1/accessory2 distinction)
        }
      }
      // If type doesn't match, use the unique's original type but still generate it
      return {
        ...uniqueTemplate,
        id: uuidv4(),
      }
    }
  }
  
  // Generate procedural item from material + base
  const material = getRandomMaterial(rarity)
  
  // Get random base template for this type
  const baseTemplate = getRandomBase(type)
  
  // Fallback if no base template found
  if (!baseTemplate) {
    // Create a minimal item
    return {
      id: uuidv4(),
      name: `${material.prefix} Item`,
      description: material.description || 'A mysterious item',
      type,
      rarity,
      stats: {},
      value: Math.floor(50 * material.valueMultiplier),
    }
  }
  
  // TypeScript now knows baseTemplate is defined
  const base: Omit<Item, 'id' | 'name' | 'rarity' | 'value'> = baseTemplate
  
  // Apply material multiplier to base stats
  const modifiedStats = applyMaterialToStats(base.stats, material.statMultiplier)
  
  // Calculate value (base 50 gold * material multiplier)
  const baseValue = 50
  const value = Math.floor(baseValue * material.valueMultiplier)
  
  // Combine material description with base description if needed
  const description = material.description 
    ? `${base.description} - ${material.description}`
    : base.description
  
  // Generate item name using base template
  const name = generateItemName(material.prefix, base)
  
  // Create final item
  return {
    id: uuidv4(),
    name,
    description,
    type,
    rarity,
    stats: modifiedStats,
    value,
  }
}

/**
 * Generate multiple items (for treasure events)
 */
export function generateItems(count: number, depth: number): Item[] {
  return Array.from({ length: count }, () => generateItem(depth))
}
