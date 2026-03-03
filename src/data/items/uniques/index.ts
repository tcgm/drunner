// Master index for unique items
import type { Item, ItemRarity, ItemSlot } from '@/types'

export * from './weapons'
export * from './armor'
export * from './helmets'
export * from './boots'
export * from './accessories'

import { UNIQUE_WEAPONS } from './weapons'
import { UNIQUE_ARMOR } from './armor'
import { UNIQUE_HELMETS } from './helmets'
import { UNIQUE_BOOTS } from './boots'
import { UNIQUE_ACCESSORIES } from './accessories'

// All unique items
export const ALL_UNIQUE_ITEMS: Array<Omit<Item, 'id'>> = [
  ...UNIQUE_WEAPONS,
  ...UNIQUE_ARMOR,
  ...UNIQUE_HELMETS,
  ...UNIQUE_BOOTS,
  ...UNIQUE_ACCESSORIES,
]

// Unique items grouped by rarity – built dynamically so any unique added at
// any rarity tier is automatically included without manual bookkeeping here.
export const UNIQUE_ITEMS_BY_RARITY: Partial<Record<ItemRarity, Array<Omit<Item, 'id'>>>> =
  ALL_UNIQUE_ITEMS.reduce<Partial<Record<ItemRarity, Array<Omit<Item, 'id'>>>>>(
    (acc, item) => {
      if (!acc[item.rarity]) acc[item.rarity] = []
      acc[item.rarity]!.push(item)
      return acc
    },
    {}
  )

// Unique items by type
export const UNIQUE_ITEMS_BY_TYPE: Record<string, Array<Omit<Item, 'id'>>> = {
  weapon: UNIQUE_WEAPONS,
  armor: UNIQUE_ARMOR,
  helmet: UNIQUE_HELMETS,
  boots: UNIQUE_BOOTS,
  accessory: UNIQUE_ACCESSORIES,
}

/**
 * Get unique items by rarity
 */
export function getUniquesByRarity(rarity: ItemRarity): Array<Omit<Item, 'id'>> {
  return UNIQUE_ITEMS_BY_RARITY[rarity] || []
}

/**
 * Get unique items by type
 */
export function getUniquesByType(type: ItemSlot): Array<Omit<Item, 'id'>> {
  const normalizedType = (type === 'accessory1' || type === 'accessory2') ? 'accessory' : type
  return UNIQUE_ITEMS_BY_TYPE[normalizedType] || []
}

/**
 * Get unique items by rarity and type
 */
export function getUniquesByRarityAndType(rarity: ItemRarity, type: ItemSlot): Array<Omit<Item, 'id'>> {
  const normalizedType = (type === 'accessory1' || type === 'accessory2') ? 'accessory' : type
  return ALL_UNIQUE_ITEMS.filter(item => 
    item.rarity === rarity && 
    (item.type === type || (normalizedType === 'accessory' && (item.type === 'accessory1' || item.type === 'accessory2')))
  )
}

/**
 * Get a random unique item for a given rarity (if any exist).
 * Picks uniformly from the full pool regardless of dropChance overrides.
 * Use this for non-loot systems (events, quests, direct drops).
 */
export function getRandomUnique(rarity: ItemRarity): Omit<Item, 'id'> | undefined {
  const uniques = getUniquesByRarity(rarity)
  if (uniques.length === 0) return undefined
  return uniques[Math.floor(Math.random() * uniques.length)]
}

/**
 * Two-phase unique item selection for loot drops.
 *
 * Phase 1 – Override items (those with a `dropChance` set):
 *   Each item rolls its own individual chance independently.
 *   If any succeed, one is chosen randomly from all winners.
 *   These items are NEVER selected via Phase 2.
 *
 * Phase 2 – General pool (items without a `dropChance`):
 *   A single roll against `baseChance` decides whether this pool fires.
 *   If it hits, a random item from the general pool is returned.
 *
 * Returns undefined if nothing fires (caller falls through to procedural generation).
 */
export function selectUniqueForLoot(
  rarity: ItemRarity,
  baseChance: number,
): Omit<Item, 'id'> | undefined {
  const all = getUniquesByRarity(rarity)
  if (all.length === 0) return undefined

  const overrides = all.filter(u => u.dropChance !== undefined)
  const general   = all.filter(u => u.dropChance === undefined)

  // Phase 1: each override item rolls its own independent chance
  const winners = overrides.filter(u => Math.random() < u.dropChance!)
  if (winners.length > 0) {
    return winners[Math.floor(Math.random() * winners.length)]
  }

  // Phase 2: single roll against the rarity-wide base chance for the general pool
  if (general.length > 0 && baseChance > 0 && Math.random() < baseChance) {
    return general[Math.floor(Math.random() * general.length)]
  }

  return undefined
}

/**
 * Get effective min/max rarity for a unique item
 * Priority: item-specific > template rarity
 */
export function getUniqueItemRarityConstraints(item: Omit<Item, 'id'>): { minRarity: ItemRarity; maxRarity: ItemRarity } {
  // Check for item-specific constraints
  if (item.minRarity || item.maxRarity) {
    return {
      minRarity: item.minRarity || item.rarity,
      maxRarity: item.maxRarity || item.rarity
    }
  }

  // Fall back to template rarity (no variable rarity)
  return {
    minRarity: item.rarity,
    maxRarity: item.rarity
  }
}
