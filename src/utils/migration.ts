/**
 * Migration utilities for converting old save data to new floor-based system
 */

import type { Dungeon, Run, GameState } from '@/types'
import { GAME_CONFIG } from '@/config/gameConfig'
import { migrateHeroArray } from './heroMigration'

/**
 * Converts depth-based dungeon to floor-based system
 * Old: 1 event = 1 depth
 * New: eventsPerFloor events + 1 boss = 1 floor
 */
export function migrateDungeon(dungeon: Dungeon): Dungeon {
  // If already migrated (has floor property), return as-is
  if (dungeon.floor !== undefined && dungeon.eventsThisFloor !== undefined) {
    // Ensure eventsRequiredThisFloor exists (for older migrations)
    if (dungeon.eventsRequiredThisFloor === undefined) {
      dungeon.eventsRequiredThisFloor = Math.floor(
        (GAME_CONFIG.dungeon.minEventsPerFloor + GAME_CONFIG.dungeon.maxEventsPerFloor) / 2
      )
    }
    return dungeon
  }

  const eventsPerFloor = Math.floor(
    (GAME_CONFIG.dungeon.minEventsPerFloor + GAME_CONFIG.dungeon.maxEventsPerFloor) / 2
  )
  const totalEventsPerFloor = eventsPerFloor + 1 // +1 for boss

  // Calculate floor from depth
  // Depth 1-5 (4 events + boss) = Floor 1
  // Depth 6-10 (4 events + boss) = Floor 2, etc.
  const floor = Math.floor((dungeon.depth - 1) / totalEventsPerFloor) + 1
  const eventsThisFloor = (dungeon.depth - 1) % totalEventsPerFloor

  // Determine if next event should be a boss
  const isNextEventBoss = eventsThisFloor >= eventsPerFloor

  return {
    ...dungeon,
    floor,
    eventsThisFloor,
    eventsRequiredThisFloor: eventsPerFloor,
    isNextEventBoss,
  }
}

/**
 * Converts old run data to include floor information
 */
export function migrateRun(run: Run): Run {
  // If already migrated, return as-is
  if (run.startFloor !== undefined && run.finalFloor !== undefined) {
    return run
  }

  const eventsPerFloor = Math.floor(
    (GAME_CONFIG.dungeon.minEventsPerFloor + GAME_CONFIG.dungeon.maxEventsPerFloor) / 2
  )
  const totalEventsPerFloor = eventsPerFloor + 1

  const startFloor = Math.floor((run.startDepth - 1) / totalEventsPerFloor) + 1
  const finalFloor = Math.floor((run.finalDepth - 1) / totalEventsPerFloor) + 1

  return {
    ...run,
    startFloor,
    finalFloor,
  }
}

/**
 * Migrates entire game state to new floor system and slot system
 */
export function migrateGameState(state: GameState): GameState {
  return {
    ...state,
    party: migrateHeroArray(state.party),
    heroRoster: migrateHeroArray(state.heroRoster),
    dungeon: migrateDungeon(state.dungeon),
    activeRun: state.activeRun ? migrateRun(state.activeRun) : null,
    runHistory: state.runHistory.map(migrateRun),
  }
}

/**
 * Calculates depth from floor and events for backwards compatibility
 */
export function floorToDepth(floor: number, eventsThisFloor: number): number {
  const eventsPerFloor = Math.floor(
    (GAME_CONFIG.dungeon.minEventsPerFloor + GAME_CONFIG.dungeon.maxEventsPerFloor) / 2
  )
  const totalEventsPerFloor = eventsPerFloor + 1

  return (floor - 1) * totalEventsPerFloor + eventsThisFloor + 1
}

/**
 * Calculates floor from depth for backwards compatibility
 */
export function depthToFloor(depth: number): { floor: number; eventsThisFloor: number } {
  const eventsPerFloor = Math.floor(
    (GAME_CONFIG.dungeon.minEventsPerFloor + GAME_CONFIG.dungeon.maxEventsPerFloor) / 2
  )
  const totalEventsPerFloor = eventsPerFloor + 1

  const floor = Math.floor((depth - 1) / totalEventsPerFloor) + 1
  const eventsThisFloor = (depth - 1) % totalEventsPerFloor

  return { floor, eventsThisFloor }
}
