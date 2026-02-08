// Master index for set items
import type { Item, ItemRarity } from '@/types'

export * from './kitsune'
export * from './draconic'
export * from './arcane'
export * from './titan'
export * from './shadow'

import { KITSUNE_SET_ITEMS, KITSUNE_SET_BONUSES, KITSUNE_SET_NAME } from './kitsune'
import { DRACONIC_SET_ITEMS, DRACONIC_SET_BONUSES, DRACONIC_SET_NAME } from './draconic'
import { ARCANE_SET_ITEMS, ARCANE_SET_BONUSES, ARCANE_SET_NAME } from './arcane'
import { TITAN_SET_ITEMS, TITAN_SET_BONUSES, TITAN_SET_NAME } from './titan'
import { SHADOW_SET_ITEMS, SHADOW_SET_BONUSES, SHADOW_SET_NAME } from './shadow'

// All set items
export const ALL_SET_ITEMS: Array<Omit<Item, 'id'>> = [
  ...KITSUNE_SET_ITEMS,
  ...DRACONIC_SET_ITEMS,
  ...ARCANE_SET_ITEMS,
  ...TITAN_SET_ITEMS,
  ...SHADOW_SET_ITEMS,
]

// Set definitions with bonuses
export interface SetBonus {
  description: string
  stats: Partial<Record<string, number>>
}

export interface SetDefinition {
  name: string
  items: Array<Omit<Item, 'id'>>
  bonuses: Record<number, SetBonus>
  minRarity?: ItemRarity  // Minimum rarity for all items in this set (can be overridden per-item)
  maxRarity?: ItemRarity  // Maximum rarity for all items in this set (can be overridden per-item)
}

export const ALL_SETS: SetDefinition[] = [
  {
    name: KITSUNE_SET_NAME,
    items: KITSUNE_SET_ITEMS,
    bonuses: KITSUNE_SET_BONUSES,
  },
  {
    name: DRACONIC_SET_NAME,
    items: DRACONIC_SET_ITEMS,
    bonuses: DRACONIC_SET_BONUSES,
  },
  {
    name: ARCANE_SET_NAME,
    items: ARCANE_SET_ITEMS,
    bonuses: ARCANE_SET_BONUSES,
  },
  {
    name: TITAN_SET_NAME,
    items: TITAN_SET_ITEMS,
    bonuses: TITAN_SET_BONUSES,
  },
  {
    name: SHADOW_SET_NAME,
    items: SHADOW_SET_ITEMS,
    bonuses: SHADOW_SET_BONUSES,
  },
]

/**
 * Get a random set item
 */
export function getRandomSetItem(): Omit<Item, 'id'> | undefined {
  if (ALL_SET_ITEMS.length === 0) return undefined
  return ALL_SET_ITEMS[Math.floor(Math.random() * ALL_SET_ITEMS.length)]
}

/**
 * Get a random item from a specific set
 */
export function getRandomSetItemBySetId(setId: string): Omit<Item, 'id'> | undefined {
  const normalizedSetId = setId.toLowerCase()
  const set = ALL_SETS.find(s => s.name.toLowerCase() === normalizedSetId)
  if (!set || set.items.length === 0) return undefined
  return set.items[Math.floor(Math.random() * set.items.length)]
}

/**
 * Get the setId from a set item name
 */
export function getSetIdFromItemName(itemName: string): string | null {
  for (const set of ALL_SETS) {
    if (set.items.some(item => item.name === itemName)) {
      return set.name.toLowerCase()
    }
  }
  return null
}

/**
 * Get set items by set name
 */
export function getSetItemsByName(setName: string): Array<Omit<Item, 'id'>> {
  const set = ALL_SETS.find(s => s.name === setName)
  return set?.items || []
}

/**
 * Identify which set an item belongs to
 */
export function getItemSetName(itemName: string): string | null {
  for (const set of ALL_SETS) {
    if (set.items.some(item => item.name === itemName)) {
      return set.name
    }
  }
  return null
}

/**
 * Get set bonuses for a given set and piece count
 */
export function getSetBonuses(setName: string, pieceCount: number): SetBonus | null {
  const set = ALL_SETS.find(s => s.name === setName)
  if (!set) return null
  
  // Get highest applicable bonus
  const applicableBonuses = Object.entries(set.bonuses)
    .filter(([count]) => pieceCount >= parseInt(count))
    .sort(([a], [b]) => parseInt(b) - parseInt(a))
  
  if (applicableBonuses.length === 0) return null
  return applicableBonuses[0][1]
}

/**
 * Get the set definition that contains the given item
 */
export function getSetDefinitionForItem(item: Omit<Item, 'id'>): SetDefinition | null {
  for (const set of ALL_SETS) {
    if (set.items.some(i => i.name === item.name)) {
      return set
    }
  }
  return null
}

/**
 * Get effective min/max rarity for a set item
 * Priority: item-specific > set-wide > template rarity
 */
export function getSetItemRarityConstraints(item: Omit<Item, 'id'>): { minRarity: ItemRarity; maxRarity: ItemRarity } {
  // Check for item-specific constraints
  if (item.minRarity || item.maxRarity) {
    return {
      minRarity: item.minRarity || item.rarity,
      maxRarity: item.maxRarity || item.rarity
    }
  }

  // Check for set-wide constraints
  const setDef = getSetDefinitionForItem(item)
  if (setDef && (setDef.minRarity || setDef.maxRarity)) {
    return {
      minRarity: setDef.minRarity || item.rarity,
      maxRarity: setDef.maxRarity || item.rarity
    }
  }

  // Fall back to template rarity (no variable rarity)
  return {
    minRarity: item.rarity,
    maxRarity: item.rarity
  }
}
