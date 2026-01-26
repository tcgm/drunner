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

// Unique items by rarity
export const UNIQUE_ITEMS_BY_RARITY: Record<ItemRarity, Array<Omit<Item, 'id'>>> = {
  junk: [],
  common: [],
  uncommon: [],
  rare: [],
  epic: ALL_UNIQUE_ITEMS.filter(item => item.rarity === 'epic'),
  legendary: ALL_UNIQUE_ITEMS.filter(item => item.rarity === 'legendary'),
  mythic: ALL_UNIQUE_ITEMS.filter(item => item.rarity === 'mythic'),
  artifact: [], // Stretch goal
  cursed: [],   // Stretch goal
  set: [],      // Stretch goal
}

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
 * Get a random unique item for a given rarity (if any exist)
 */
export function getRandomUnique(rarity: ItemRarity): Omit<Item, 'id'> | undefined {
  const uniques = getUniquesByRarity(rarity)
  if (uniques.length === 0) return undefined
  return uniques[Math.floor(Math.random() * uniques.length)]
}
