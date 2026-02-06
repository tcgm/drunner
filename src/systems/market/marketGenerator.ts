/**
 * Market Hall generation system
 * Handles stall inventory generation with floor scaling and rarity tiers
 */

import type { Consumable, Hero } from '@/types'
import { GAME_CONFIG } from '@/config/gameConfig'
import { generateConsumable } from '@/systems/consumables/consumableGenerator'
import { getRandomFoodBase } from '@/data/consumables/food'
import { getRandomSupplyBase } from '@/data/consumables/supplies'
import { getRandomSize } from '@/data/consumables/sizes'
import { getRandomPotency } from '@/data/consumables/potencies'

export interface MarketStall {
  id: 'food' | 'supplies' | 'premium'
  items: Consumable[]
}

/**
 * Calculate effective floor for market based on party average level
 * Formula: partyAvgLevel * floorScaling
 */
export function calculateMarketFloor(party: (Hero | null)[]): number {
  const activeHeroes = party.filter((h): h is Hero => h !== null)
  if (activeHeroes.length === 0) return 1
  
  const avgLevel = activeHeroes.reduce((sum, h) => sum + h.level, 0) / activeHeroes.length
  return Math.max(1, Math.floor(avgLevel * GAME_CONFIG.market.floorScaling))
}

/**
 * Roll rarity based on configured chances for a stall type
 */
function rollRarity(stallType: 'food' | 'supplies' | 'premium'): 'common' | 'uncommon' | 'rare' | 'legendary' | 'mythic' | 'mythicc' {
  const chances = GAME_CONFIG.market.rarityChances[stallType]
  const roll = Math.random()
  
  if (stallType === 'premium') {
    if ('mythicc' in chances && roll < (chances.mythicc || 0)) return 'mythicc'
    if ('mythic' in chances && roll < (chances.mythic || 0)) return 'mythic'
    if ('legendary' in chances && roll < (chances.legendary || 0)) return 'legendary'
    if (roll < (chances.rare || 0)) return 'rare'
    if (roll < (chances.uncommon || 0)) return 'uncommon'
  } else {
    if (roll < (chances.rare || 0)) return 'rare'
    if (roll < (chances.uncommon || 0)) return 'uncommon'
  }
  
  return 'common'
}

/**
 * Generate items for a single stall
 */
function generateStallItems(
  stallType: 'food' | 'supplies' | 'premium',
  baseFloor: number
): Consumable[] {
  const items: Consumable[] = []
  const floorBonus = GAME_CONFIG.market.floorBonuses[stallType]
  const effectiveFloor = baseFloor + floorBonus
  
  for (let i = 0; i < GAME_CONFIG.market.stallSize; i++) {
    // Select base type
    const base = stallType === 'food' 
      ? getRandomFoodBase()
      : stallType === 'supplies'
      ? getRandomSupplyBase()
      : Math.random() < 0.5 ? getRandomFoodBase() : getRandomSupplyBase() // Premium mixes both
    
    const size = getRandomSize()
    const potency = getRandomPotency()
    const rarity = rollRarity(stallType)
    
    const item = generateConsumable(base.id, size.id, potency.id, rarity, effectiveFloor)
    items.push(item)
  }
  
  return items
}

/**
 * Generate all market stalls for the current party
 * Returns array of stalls with their generated items
 */
export function generateMarketInventory(party: (Hero | null)[]): MarketStall[] {
  const baseFloor = calculateMarketFloor(party)
  
  return [
    {
      id: 'food',
      items: generateStallItems('food', baseFloor),
    },
    {
      id: 'supplies',
      items: generateStallItems('supplies', baseFloor),
    },
    {
      id: 'premium',
      items: generateStallItems('premium', baseFloor),
    },
  ]
}
