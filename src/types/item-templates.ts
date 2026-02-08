import type { Item, ItemRarity } from './index'

/**
 * Extended template types for unique and set items
 * These include optional rarity constraints that control which rarities can be rolled
 */

/**
 * Template for unique items with optional rarity constraints
 */
export interface UniqueItemTemplate extends Omit<Item, 'id'> {
    minRarity?: ItemRarity  // Minimum rarity this unique can roll at (defaults to template rarity)
    maxRarity?: ItemRarity  // Maximum rarity this unique can roll at (defaults to template rarity)
}

/**
 * Template for set items with optional rarity constraints
 */
export interface SetItemTemplate extends Omit<Item, 'id'> {
    minRarity?: ItemRarity  // Minimum rarity this set item can roll at (overrides set default)
    maxRarity?: ItemRarity  // Maximum rarity this set item can roll at (overrides set default)
}
