export const DUNGEON_CONFIG = {
  maxFloors: 100, // Maximum number of floors before victory
  majorBossInterval: 10, // Major boss every N floors (zone completion)
  minEventsPerFloor: 5, // Minimum map rows (height) per floor
  maxEventsPerFloor: 12, // Maximum map rows (height) per floor
  eventsPerFloorScaling: 0.2, // Additional rows added per floor number (scales with depth)
  allowMerchantBeforeBoss: true, // Can merchant appear as last event before boss
  allowRestBeforeBoss: true, // Can rest appear before boss
  floorUnlockFraction: 2, // Floors at or below (party avg level * this) are free to enter
  floorSkipBaseCost: 33, // Base alkahest cost to skip to a floor
  floorSkipCostMultiplier: 1.25, // Cost multiplier per floor skipped beyond free floors
} as const

export const MULTIPLIERS_CONFIG = {
  xp: 0.1, // Global XP multiplier
  gold: 1.0, // Global gold multiplier
  damage: 1.0, // Global damage multiplier (affects both player and enemy)
  healing: 1.0, // Global healing multiplier
  dropRate: 1.0, // Item drop rate multiplier
} as const

export const SCALING_CONFIG = {
  damage: 0.35, // 35% per floor for regular events
  floorBossDamage: 0.45, // 45% per floor for floor bosses
  zoneBossDamage: 0.60, // 60% per floor for zone bosses (major bosses every 10 floors)
  trueDamage: 0.12, // 12% per floor for true damage (bypasses defense so scales slower)
  healing: 0.015, // 1.5% per floor
  rewards: 0.05, // 5% per floor (XP/Gold)
  statRequirements: 0.05, // 5% per floor
} as const

export const EVENTS_CONFIG = {
  recentEventMemory: 10, // How many recent events to avoid repeating
} as const

export const PARTY_CONFIG = {
  maxSize: 4, // Maximum party size (can be expanded later)
} as const
