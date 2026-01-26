import type { Item, ItemRarity, Hero } from '@/types'
import { generateItem } from './lootGenerator'

/**
 * Rarity tier ordering for upgrades
 */
const RARITY_ORDER: ItemRarity[] = [
  'junk',
  'common',
  'uncommon',
  'rare',
  'epic',
  'legendary',
  'mythic'
]

/**
 * Get the next rarity tier
 */
function getNextRarity(currentRarity: ItemRarity): ItemRarity | null {
  const currentIndex = RARITY_ORDER.indexOf(currentRarity)
  if (currentIndex === -1 || currentIndex >= RARITY_ORDER.length - 1) {
    return null // Already at max rarity
  }
  return RARITY_ORDER[currentIndex + 1]
}

/**
 * Find the lowest rarity equipped item from a party member
 */
export function findLowestRarityItem(hero: Hero): { item: Item; slot: string } | null {
  const equipment = hero.equipment
  const slots = ['weapon', 'armor', 'helmet', 'boots', 'accessory1', 'accessory2'] as const
  
  let lowestItem: { item: Item; slot: string } | null = null
  let lowestRarityIndex = RARITY_ORDER.length
  
  for (const slot of slots) {
    const item = equipment[slot]
    if (item) {
      const rarityIndex = RARITY_ORDER.indexOf(item.rarity)
      if (rarityIndex !== -1 && rarityIndex < lowestRarityIndex) {
        lowestRarityIndex = rarityIndex
        lowestItem = { item, slot }
      }
    }
  }
  
  return lowestItem
}

/**
 * Find the lowest rarity item in a collection prioritizing lower rarities
 */
export function findLowestRarityItemInCollection(items: Item[]): Item | null {
  if (items.length === 0) return null
  
  let lowestItem: Item | null = null
  let lowestRarityIndex = RARITY_ORDER.length
  
  for (const item of items) {
    const rarityIndex = RARITY_ORDER.indexOf(item.rarity)
    if (rarityIndex !== -1 && rarityIndex < lowestRarityIndex) {
      lowestRarityIndex = rarityIndex
      lowestItem = item
    }
  }
  
  return lowestItem
}

/**
 * Upgrade an item to the next rarity tier
 * Returns a new item of the same type but higher rarity
 */
export function upgradeItemRarity(
  item: Item,
  depth: number,
  rarityBoost: number = 0
): Item | null {
  const nextRarity = getNextRarity(item.rarity)
  if (!nextRarity) {
    return null // Can't upgrade mythic items
  }
  
  // Generate a new item of the same type but with higher rarity
  const upgradedItem = generateItem(
    depth,
    item.type,
    nextRarity,
    nextRarity, // Force exactly the next rarity tier
    rarityBoost
  )
  
  return upgradedItem
}

/**
 * Get the rarity index for comparison
 */
export function getRarityIndex(rarity: ItemRarity): number {
  return RARITY_ORDER.indexOf(rarity)
}
