/**
 * Game configuration and balance settings
 */

export const GAME_CONFIG = {
  // UI Colors (centralized color control)
  colors: {
    // Resource colors
    hp: {
      base: 'green.400',
      light: 'green.300',
      dark: 'green.500',
      glow: 'rgba(72, 187, 120, 0.8)', // #48bb78
      hex: '#48bb78',
    },
    xp: {
      base: 'cyan.400',
      light: 'cyan.300',
      dark: 'cyan.500',
      glow: 'rgba(56, 189, 248, 0.8)', // #38bdf8
      hex: '#38bdf8',
    },
    gold: {
      base: 'yellow.400',
      light: 'yellow.300',
      dark: 'yellow.500',
      glow: 'rgba(246, 224, 94, 0.8)', // #f6e05e
      hex: '#f6e05e',
    },
    damage: {
      base: 'red.400',
      light: 'red.300',
      dark: 'red.500',
      glow: 'rgba(245, 101, 101, 0.8)', // #f56565
      hex: '#f56565',
    },
    heal: {
      base: 'green.400',
      light: 'green.300',
      dark: 'green.500',
      glow: 'rgba(72, 187, 120, 0.8)', // #48bb78
      hex: '#48bb78',
    },
    // Stat colors
    stats: {
      attack: 'red.400',
      defense: 'blue.400',
      speed: 'yellow.400',
      luck: 'purple.400',
      magicPower: 'purple.400',
    },
    // Rarity colors
    rarity: {
      common: 'gray.500',
      uncommon: 'green.400',
      rare: 'blue.400',
      epic: 'purple.400',
      legendary: 'orange.400',
      mythic: 'red.400',
    },
    // UI element colors
    ui: {
      level: 'orange.300',
      positive: 'green.400',
      negative: 'red.400',
      neutral: 'gray.400',
      highlight: 'orange.400',
    },
  },

  // Floating Numbers (visual feedback)
  floatingNumbers: {
    duration: 250, // Animation duration in milliseconds
    travelDistance: 20, // Vertical distance traveled in pixels
    horizontalDrift: 30, // Maximum horizontal drift in pixels
    fontSizes: {
      damage: '3xl',
      heal: '2xl',
      xp: 'xl',
      gold: 'xl',
    },
  },

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
    maxFloors: 100, // Maximum number of floors before victory
    majorBossInterval: 10, // Major boss every N floors (zone completion)
    minEventsPerFloor: 3, // Minimum number of normal events before floor boss
    maxEventsPerFloor: 7, // Maximum number of normal events before floor boss
    allowMerchantBeforeBoss: true, // Can merchant appear as last event before boss
    allowRestBeforeBoss: true, // Can rest appear before boss
    floorUnlockFraction: 0.75, // Floors at or below (party avg level * this) are free to enter
    floorSkipBaseCost: 33, // Base alkahest cost to skip to a floor
    floorSkipCostMultiplier: 1.5, // Cost multiplier per floor skipped beyond free floors
  },

  // Item Management
  items: {
    alkahestConversionRate: 0.35, // 25% of item value converted to alkahest when discarded
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
    defaultSuccess: 0.0, // 0% default success chance for skill checks
    minSuccess: 0.05, // 5% minimum success chance (always a chance)
    maxSuccess: 0.95, // 95% cap on success chance (never guaranteed)
    statBonusPerPoint: 0.002, // 0.2% success chance per stat point (100 stat = 20% bonus)
  },

  // Combat
  combat: {
    // Defense formula options
    defenseFormula: 'logarithmic' as 'flat' | 'percentage' | 'logarithmic' | 'hybrid',
    // 'flat': Simple flat reduction (defense * defenseReduction)
    // 'percentage': Diminishing returns (defense / (defense + percentageBase))
    // 'logarithmic': Armor formula ((defense * logFactor) / (1 + defense * logFactor))
    // 'hybrid': Capped percentage (min(maxReduction, defense / (defense + hybridBase)))

    // Flat formula settings
    defenseReduction: 0.5, // 50% of defense reduces damage (flat formula)

    // Percentage formula settings
    percentageBase: 200, // Base value for percentage formula (higher = less reduction per point)

    // Logarithmic formula settings
    logFactor: 0.025, // Scaling factor for logarithmic formula
    // Higher values = more reduction per point of defense, lower values = less reduction
    maxLogReduction: 0.90, // Maximum damage reduction cap for logarithmic formula (90%)

    // Hybrid formula settings
    hybridBase: 75, // Base value for hybrid formula
    maxReduction: 0.8, // Maximum damage reduction (80%) for hybrid formula

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
    damage: 0.35, // 35% per floor for regular events
    floorBossDamage: 0.45, // 45% per floor for floor bosses
    zoneBossDamage: 0.60, // 60% per floor for zone bosses (major bosses every 10 floors)
    trueDamage: 0.12, // 12% per floor for true damage (bypasses defense so scales slower)
    healing: 0.015, // 1.5% per floor
    rewards: 0.05, // 5% per floor (XP/Gold)
    statRequirements: 0.25, // 15% per floor
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
