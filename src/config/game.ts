/**
 * Game configuration and balance settings
 */

export const GAME_CONFIG = {
  // Leveling
  levelUp: {
    healToFull: false, // Whether leveling up fully restores HP
    maxLevel: 20,
    xpPerLevel: 100, // Base XP needed per level (level * this value)
  },

  // Stat gains per level
  statGains: {
    attack: 5,
    defense: 5,
    speed: 5,
    luck: 5,
    maxHp: 5,
  },

  // Dungeon
  dungeon: {
    maxDepth: 100,
    bossFloorInterval: 10, // Boss every N floors
  },

  // Item Management
  items: {
    alkahestConversionRate: 0.25, // 25% of item value converted to alkahest when discarded
  },

  // Scaling
  scaling: {
    damage: 0.1, // 10% per depth
    healing: 0.08, // 8% per depth
    rewards: 0.15, // 15% per depth (XP/Gold)
    statRequirements: 0.05, // 5% per depth
  },

  // Event system
  events: {
    recentEventMemory: 10, // How many recent events to avoid repeating
  },

  // Death penalties
  deathPenalty: {
    type: 'halve-levels' as 'none' | 'halve-levels' | 'reset-levels' | 'lose-equipment',
    // 'none': No penalty, heroes keep everything
    // 'halve-levels': Heroes lose half their levels (rounded down, min 1)
    // 'reset-levels': Heroes reset to level 1
    // 'lose-equipment': Heroes keep levels but lose all equipment
    loseAllGoldOnDefeat: true, // Whether defeated heroes lose all gold
  },
} as const
