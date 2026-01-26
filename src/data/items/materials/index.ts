import type { ItemRarity, ItemSlot } from '@/types'

/**
 * Material definition - modifies base item stats and determines rarity
 */
export interface Material {
  id: string
  name: string
  prefix: string // "Iron", "Steel", etc.
  rarity: ItemRarity
  statMultiplier: number // Multiplies base item stats
  valueMultiplier: number // Multiplies base item value
  description?: string
  blacklist?: ItemSlot[] // Item types this material can't be used with
}

// Junk tier materials
export const RUSTY: Material = {
  id: 'rusty',
  name: 'Rusty',
  prefix: 'Rusty',
  rarity: 'junk',
  statMultiplier: 0.5,
  valueMultiplier: 0.3,
  description: 'Corroded and barely functional'
}

export const BROKEN: Material = {
  id: 'broken',
  name: 'Broken',
  prefix: 'Broken',
  rarity: 'junk',
  statMultiplier: 0.6,
  valueMultiplier: 0.4,
  description: 'Damaged and unreliable'
}

export const WORN: Material = {
  id: 'worn',
  name: 'Worn',
  prefix: 'Worn',
  rarity: 'junk',
  statMultiplier: 0.7,
  valueMultiplier: 0.5,
  description: 'Heavily used and deteriorated'
}

// Common tier materials
export const IRON: Material = {
  id: 'iron',
  name: 'Iron',
  prefix: 'Iron',
  rarity: 'common',
  statMultiplier: 1.0,
  valueMultiplier: 1.0,
  description: 'Standard quality metal'
}

export const LEATHER: Material = {
  id: 'leather',
  name: 'Leather',
  prefix: 'Leather',
  rarity: 'common',
  statMultiplier: 1.0,
  valueMultiplier: 1.0,
  description: 'Common leather armor',
  blacklist: ['weapon'] // Leather shouldn't be used for weapons
}

export const BRONZE: Material = {
  id: 'bronze',
  name: 'Bronze',
  prefix: 'Bronze',
  rarity: 'common',
  statMultiplier: 1.1,
  valueMultiplier: 1.2,
  description: 'Sturdy bronze equipment'
}

// Uncommon tier materials
export const STEEL: Material = {
  id: 'steel',
  name: 'Steel',
  prefix: 'Steel',
  rarity: 'uncommon',
  statMultiplier: 1.5,
  valueMultiplier: 2.0,
  description: 'High quality forged steel'
}

export const REINFORCED_LEATHER: Material = {
  id: 'reinforced_leather',
  name: 'Reinforced Leather',
  prefix: 'Reinforced',
  rarity: 'uncommon',
  statMultiplier: 1.4,
  valueMultiplier: 1.8,
  description: 'Enhanced with metal studs',
  blacklist: ['weapon'] // Leather shouldn't be used for weapons
}

export const SILVER: Material = {
  id: 'silver',
  name: 'Silver',
  prefix: 'Silver',
  rarity: 'uncommon',
  statMultiplier: 1.6,
  valueMultiplier: 2.5,
  description: 'Blessed silver, effective against evil'
}

// Rare tier materials
export const MITHRIL: Material = {
  id: 'mithril',
  name: 'Mithril',
  prefix: 'Mithril',
  rarity: 'rare',
  statMultiplier: 2.0,
  valueMultiplier: 4.0,
  description: 'Light but incredibly strong'
}

export const DRAGONSCALE: Material = {
  id: 'dragonscale',
  name: 'Dragonscale',
  prefix: 'Dragonscale',
  rarity: 'rare',
  statMultiplier: 2.2,
  valueMultiplier: 5.0,
  description: 'Harvested from dragon hide',
  blacklist: ['weapon'] // Scales are for armor, not weapons
}

export const ENCHANTED: Material = {
  id: 'enchanted',
  name: 'Enchanted',
  prefix: 'Enchanted',
  rarity: 'rare',
  statMultiplier: 2.5,
  valueMultiplier: 6.0,
  description: 'Imbued with magical energy'
}

// Epic tier materials
export const ADAMANTINE: Material = {
  id: 'adamantine',
  name: 'Adamantine',
  prefix: 'Adamantine',
  rarity: 'epic',
  statMultiplier: 3.0,
  valueMultiplier: 10.0,
  description: 'Nearly indestructible metal'
}

export const CELESTIAL: Material = {
  id: 'celestial',
  name: 'Celestial',
  prefix: 'Celestial',
  rarity: 'epic',
  statMultiplier: 3.5,
  valueMultiplier: 12.0,
  description: 'Forged in the heavens'
}

export const DEMON: Material = {
  id: 'demon',
  name: 'Demon',
  prefix: 'Demon',
  rarity: 'epic',
  statMultiplier: 4.0,
  valueMultiplier: 15.0,
  description: 'Crafted from demonic essence'
}

// Legendary tier materials
export const DIVINE: Material = {
  id: 'divine',
  name: 'Divine',
  prefix: 'Divine',
  rarity: 'legendary',
  statMultiplier: 5.0,
  valueMultiplier: 25.0,
  description: 'Blessed by the gods'
}

export const ANCIENT: Material = {
  id: 'ancient',
  name: 'Ancient',
  prefix: 'Ancient',
  rarity: 'legendary',
  statMultiplier: 5.5,
  valueMultiplier: 30.0,
  description: 'From a forgotten age'
}

export const VOID: Material = {
  id: 'void',
  name: 'Void',
  prefix: 'Void',
  rarity: 'legendary',
  statMultiplier: 6.0,
  valueMultiplier: 35.0,
  description: 'Forged from the void itself'
}

// Mythic tier materials
export const PRIMORDIAL: Material = {
  id: 'primordial',
  name: 'Primordial',
  prefix: 'Primordial',
  rarity: 'mythic',
  statMultiplier: 8.0,
  valueMultiplier: 50.0,
  description: 'Existed since the dawn of time'
}

export const COSMIC: Material = {
  id: 'cosmic',
  name: 'Cosmic',
  prefix: 'Cosmic',
  rarity: 'mythic',
  statMultiplier: 10.0,
  valueMultiplier: 75.0,
  description: 'Woven from starlight'
}

export const ETERNAL: Material = {
  id: 'eternal',
  name: 'Eternal',
  prefix: 'Eternal',
  rarity: 'mythic',
  statMultiplier: 12.0,
  valueMultiplier: 100.0,
  description: 'Timeless and imperishable'
}

// Organize materials by rarity
export const MATERIALS_BY_RARITY: Record<ItemRarity, Material[]> = {
  junk: [RUSTY, BROKEN, WORN],
  common: [IRON, LEATHER, BRONZE],
  uncommon: [STEEL, REINFORCED_LEATHER, SILVER],
  rare: [MITHRIL, DRAGONSCALE, ENCHANTED],
  epic: [ADAMANTINE, CELESTIAL, DEMON],
  legendary: [DIVINE, ANCIENT, VOID],
  mythic: [PRIMORDIAL, COSMIC, ETERNAL],
  artifact: [], // Stretch goal
  cursed: [],   // Stretch goal
  set: [],      // Stretch goal
}

// All materials
export const ALL_MATERIALS: Material[] = [
  RUSTY, BROKEN, WORN,
  IRON, LEATHER, BRONZE,
  STEEL, REINFORCED_LEATHER, SILVER,
  MITHRIL, DRAGONSCALE, ENCHANTED,
  ADAMANTINE, CELESTIAL, DEMON,
  DIVINE, ANCIENT, VOID,
  PRIMORDIAL, COSMIC, ETERNAL,
]

/**
 * Get materials by rarity
 */
export function getMaterialsByRarity(rarity: ItemRarity): Material[] {
  return MATERIALS_BY_RARITY[rarity] || []
}

/**
 * Get a random material for a given rarity
 */
export function getRandomMaterial(rarity: ItemRarity): Material {
  const materials = getMaterialsByRarity(rarity)
  if (materials.length === 0) {
    // Fallback to common
    return IRON
  }
  return materials[Math.floor(Math.random() * materials.length)]
}

/**
 * Get a random material that's compatible with a specific item type
 */
export function getCompatibleMaterial(rarity: ItemRarity, itemType: ItemSlot): Material {
  const materials = getMaterialsByRarity(rarity)
  // Filter out materials that blacklist this item type
  const compatible = materials.filter(m => !m.blacklist || !m.blacklist.includes(itemType))
  
  if (compatible.length === 0) {
    // If no compatible materials found, just return any material (fallback)
    return getRandomMaterial(rarity)
  }
  
  return compatible[Math.floor(Math.random() * compatible.length)]
}
