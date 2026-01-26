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

  // Bank
  bank: {
    startingSlots: 20, // Initial number of bank slots
    costPerSlot: 500, // Gold cost per slot when expanding
  },

  // Hero Stats
  hero: {
    baseHp: 50, // Base HP at level 1
    hpPerLevel: 10, // HP gained per level
    hpPerDefense: 5, // HP gained per defense point
    statGainPerLevel: 5, // Stat points gained per level
  },

  // Chance System
  chances: {
    defaultSuccess: 0.5, // 50% default success chance for skill checks
    maxSuccess: 0.95, // 95% cap on success chance
    statBonusPerPoint: 0.02, // 2% success chance per stat point
  },

  // Combat
  combat: {
    defenseReduction: 0.5, // 50% of defense reduces damage
    mentorXpShare: 0.5, // 50% of overflow XP shared with lower level heroes
    defaultHealPercent: 0.5, // 50% max HP when no heal amount specified
  },

  // Loot Generation
  loot: {
    baseItemValue: 50, // Base value for crafted items
    uniqueChances: {
      epic: 0.15, // 15% chance for epic uniques
      legendary: 0.30, // 30% chance for legendary uniques
      mythic: 0.50, // 50% chance for mythic uniques
    },
    setChance: 0.05, // 5% chance for set item drops
  },

  // Multipliers (adjustable game balance)
  multipliers: {
    xp: 0.1, // Global XP multiplier
    gold: 1.0, // Global gold multiplier
    damage: 1.0, // Global damage multiplier (affects both player and enemy)
    healing: 1.0, // Global healing multiplier
    dropRate: 1.0, // Item drop rate multiplier
  },

  // Scaling
  scaling: {
    damage: 0.1, // 10% per depth
    healing: 0.08, // 8% per depth
    rewards: 0.05, // 5% per depth (XP/Gold)
    statRequirements: 0.15, // 15% per depth
  },

  // Event system
  events: {
    recentEventMemory: 10, // How many recent events to avoid repeating
  },

  // Party
  party: {
    maxSize: 4, // Maximum party size (can be expanded later)
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
