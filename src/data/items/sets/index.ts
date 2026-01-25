// Master index for set items
import type { Item } from '@/types'

export * from './kitsune'

import { KITSUNE_SET_ITEMS, KITSUNE_SET_BONUSES, KITSUNE_SET_NAME } from './kitsune'

// All set items
export const ALL_SET_ITEMS: Array<Omit<Item, 'id'>> = [
  ...KITSUNE_SET_ITEMS,
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
}

export const ALL_SETS: SetDefinition[] = [
  {
    name: KITSUNE_SET_NAME,
    items: KITSUNE_SET_ITEMS,
    bonuses: KITSUNE_SET_BONUSES,
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
 * Get set items by set name
 */
export function getSetItemsByName(setName: string): Array<Omit<Item, 'id'>> {
  const set = ALL_SETS.find(s => s.name === setName)
  return set?.items || []
}

/**
 * Identify which set an item belongs to (by name prefix)
 */
export function getItemSetName(itemName: string): string | null {
  for (const set of ALL_SETS) {
    if (itemName.startsWith(set.name)) {
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
