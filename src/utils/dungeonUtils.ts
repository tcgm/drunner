import { GAME_CONFIG } from '@/config/gameConfig'
import type { Hero } from '@/types/hero'

/**
 * Calculate the free floor threshold based on party average level
 */
export function calculateFreeFloorThreshold(party: (Hero | null)[]): number {
  const activeHeroes = party.filter((h): h is Hero => h !== null)
  const partyAvgLevel = activeHeroes.length > 0
    ? Math.floor(activeHeroes.reduce((sum, h) => sum + h.level, 0) / activeHeroes.length)
    : 1
  return Math.floor(partyAvgLevel * GAME_CONFIG.dungeon.floorUnlockFraction)
}

/**
 * Calculate the alkahest cost to skip to a specific floor
 * @param targetFloor - The floor to skip to
 * @param freeFloorThreshold - Floors at or below this are free
 * @returns The alkahest cost (0 if floor is free or below threshold)
 */
export function calculateFloorSkipCost(
  targetFloor: number,
  freeFloorThreshold: number
): number {
  if (targetFloor <= freeFloorThreshold) return 0
  
  const floorsSkipped = targetFloor - freeFloorThreshold
  return Math.floor(
    GAME_CONFIG.dungeon.floorSkipBaseCost *
      Math.pow(GAME_CONFIG.dungeon.floorSkipCostMultiplier, floorsSkipped - 1)
  )
}
