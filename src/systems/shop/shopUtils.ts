import { GAME_CONFIG } from '@/config/gameConfig'
import type { Item, Consumable } from '@/types'

export type MarketStallId = 'food' | 'supplies' | 'premium'

// ─── Shop (Potion Shop) ────────────────────────────────────────────────────────

/**
 * Calculates the shop purchase price for an item or consumable.
 * Applies the configured price multiplier on top of base value.
 */
export function getShopPrice(item: Item | Consumable): number {
  return Math.floor(item.value * GAME_CONFIG.shop.priceMultiplier)
}

/**
 * Calculates the shop refresh cost given the total remaining unpurchased value.
 */
export function getShopRefreshCost(remainingValue: number): number {
  return Math.ceil(
    GAME_CONFIG.shop.refreshBaseCost +
    remainingValue * GAME_CONFIG.shop.refreshCostMultiplier
  )
}

// ─── Market Hall ──────────────────────────────────────────────────────────────

/**
 * Returns the price multiplier for a given market stall.
 */
export function getMarketStallMultiplier(stallId: MarketStallId): number {
  return GAME_CONFIG.market.priceMultipliers[stallId]
}

/**
 * Calculates the market purchase price for a consumable based on its stall.
 */
export function getMarketPrice(item: Consumable, stallId: MarketStallId): number {
  return Math.floor(item.value * getMarketStallMultiplier(stallId))
}

/**
 * Calculates the market refresh cost given the total remaining unpurchased value.
 */
export function getMarketRefreshCost(remainingValue: number): number {
  return Math.ceil(
    GAME_CONFIG.market.refreshBaseCost +
    remainingValue * GAME_CONFIG.market.refreshCostMultiplier
  )
}
