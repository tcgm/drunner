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

// Import all materials
import { RUSTY } from './junk/rusty'
import { BROKEN } from './junk/broken'
import { WORN } from './junk/worn'
import { IRON } from './common/iron'
import { LEATHER } from './common/leather'
import { BRONZE } from './common/bronze'
import { STEEL } from './uncommon/steel'
import { REINFORCED_LEATHER } from './uncommon/reinforcedLeather'
import { SILVER } from './uncommon/silver'
import { MITHRIL } from './rare/mithril'
import { DRAGONSCALE } from './rare/dragonscale'
import { ENCHANTED } from './rare/enchanted'
import { ADAMANTINE } from './epic/adamantine'
import { CELESTIAL } from './epic/celestial'
import { DEMON } from './epic/demon'
import { DIVINE } from './legendary/divine'
import { ANCIENT } from './legendary/ancient'
import { VOID } from './legendary/void'
import { PRIMORDIAL } from './mythic/primordial'
import { COSMIC } from './mythic/cosmic'
import { ETERNAL } from './mythic/eternal'
import { ADAMANTIUM } from './mythic/adamantium'

// Re-export all materials
export {
  RUSTY,
  BROKEN,
  WORN,
  IRON,
  LEATHER,
  BRONZE,
  STEEL,
  REINFORCED_LEATHER,
  SILVER,
  MITHRIL,
  DRAGONSCALE,
  ENCHANTED,
  ADAMANTINE,
  CELESTIAL,
  DEMON,
  DIVINE,
  ANCIENT,
  VOID,
  PRIMORDIAL,
  COSMIC,
  ETERNAL,
  ADAMANTIUM,
}

// Group materials by rarity
export const MATERIALS_BY_RARITY: Record<ItemRarity, Material[]> = {
  junk: [RUSTY, BROKEN, WORN],
  common: [IRON, LEATHER, BRONZE],
  uncommon: [STEEL, REINFORCED_LEATHER, SILVER],
  rare: [MITHRIL, DRAGONSCALE, ENCHANTED],
  epic: [ADAMANTINE, CELESTIAL, DEMON],
  legendary: [DIVINE, ANCIENT, VOID],
  mythic: [PRIMORDIAL, COSMIC, ETERNAL, ADAMANTIUM],
  artifact: [],
  set: [],
}

// All materials
export const ALL_MATERIALS: Material[] = [
  RUSTY, BROKEN, WORN,
  IRON, LEATHER, BRONZE,
  STEEL, REINFORCED_LEATHER, SILVER,
  MITHRIL, DRAGONSCALE, ENCHANTED,
  ADAMANTINE, CELESTIAL, DEMON,
  DIVINE, ANCIENT, VOID,
  PRIMORDIAL, COSMIC, ETERNAL, ADAMANTIUM,
]

// Alias for easier import
export const allMaterials = ALL_MATERIALS

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

/**
 * Get a material by its ID
 */
export function getMaterialById(id: string): Material | undefined {
  return ALL_MATERIALS.find(m => m.id === id)
}
