export const DEATH_PENALTY_CONFIG = {
  type: 'halve-levels' as 'none' | 'halve-levels' | 'reset-levels' | 'lose-equipment',
  // 'none': No penalty, heroes keep everything
  // 'halve-levels': Heroes lose half their levels (rounded down, min 1)
  // 'reset-levels': Heroes reset to level 1
  // 'lose-equipment': Heroes keep levels but lose all equipment
  loseAllGoldOnDefeat: true, // Whether defeated heroes lose all gold
} as const
