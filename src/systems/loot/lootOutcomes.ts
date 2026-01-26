import type { EventOutcome } from '@/types'
import { generateItem, generateItems } from './lootGenerator'

/**
 * Create a treasure outcome with dynamically generated loot
 */
export function createTreasureOutcome(
  depth: number,
  itemCount: number = 1,
  goldBonus: number = 0
): EventOutcome {
  const items = generateItems(itemCount, depth)
  
  return {
    text: `You found ${itemCount > 1 ? 'treasures' : 'a treasure'}!`,
    effects: [
      ...items.map(item => ({
        type: 'item' as const,
        item,
      })),
      ...(goldBonus > 0 ? [{
        type: 'gold' as const,
        value: goldBonus,
      }] : [])
    ]
  }
}

/**
 * Create a merchant outcome for buying an item
 */
export function createMerchantBuyOutcome(
  depth: number,
  cost: number
): EventOutcome {
  const item = generateItem(depth)
  
  return {
    text: `You purchased ${item.name} for ${cost} gold.`,
    effects: [
      {
        type: 'gold',
        value: -cost,
      },
      {
        type: 'item',
        item,
      }
    ]
  }
}

/**
 * Create outcome for selling items
 */
export function createSellItemOutcome(goldEarned: number): EventOutcome {
  return {
    text: `You sold your items for ${goldEarned} gold.`,
    effects: [
      {
        type: 'gold',
        value: goldEarned,
      }
    ]
  }
}
