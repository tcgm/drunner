export const LEVEL_UP_CONFIG = {
  healToFull: false, // Whether leveling up fully restores HP
  maxLevel: 20,
  xpPerLevel: 100, // Base XP needed per level (level * this value)
} as const

export const HERO_STATS_CONFIG = {
  baseHp: 50, // Base HP at level 1
  hpPerLevel: 10, // HP gained per level
  hpPerDefense: 5, // HP gained per defense point
  statGainPerLevel: 5, // Stat points gained per level
} as const

export const CHANCES_CONFIG = {
  defaultSuccess: 0.0, // 0% default success chance for skill checks
  minSuccess: 0.05, // 5% minimum success chance (always a chance)
  maxSuccess: 0.95, // 95% cap on success chance (never guaranteed)
  statBonusPerPoint: 0.002, // 0.2% success chance per stat point (100 stat = 20% bonus)
} as const
