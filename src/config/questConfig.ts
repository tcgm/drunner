/**
 * Guild Hall & Quest system configuration
 * All tunable numbers live here so balance tweaks don't require hunting through logic files.
 */

import type { QuestDifficulty, QuestType } from '@/types/quests'

export const QUEST_CONFIG = {

  // ── Board / timing ────────────────────────────────────────────────────────

  /** Conversion formula: multiply any hour value by this to get milliseconds */
  msPerHour: 60 * 60 * 1000,

  /** How often the board force-replaces all available quests (hours). Default: 2 */
  refreshIntervalHours: 0.15,

  /** How long an available quest stays before expiring if not accepted (hours). Default: 6 */
  expiryHours: 1,

  /** How long a claimed quest stays visible before being pruned from the list (hours). Default: 24 */
  claimedRetentionHours: 24,

  /** Number of available quest slots shown on the board at once */
  boardSlots: 3,

  /** Maximum quests a player may hold as active simultaneously */
  maxActiveQuests: 3,

  // ── Party power scaling ───────────────────────────────────────────────────

  /**
   * Divides total party stat when computing party power.
   * Higher = gear contributes less to the power score.
   *   power = avgLevel + avgStat / partyPowerStatDivisor
   */
  partyPowerStatDivisor: 15,

  /**
   * Normalises party power for the rarity-roll bias curve.
   * At power = rarityRollPowerScale the bias fully favours high-tier rarities.
   */
  rarityRollPowerScale: 30,

  // ── Difficulty multipliers ────────────────────────────────────────────────

  /** Requirement scaling per difficulty (applied as a flat multiplier to the base formula). */
  difficultyReqMult: {
    easy:   1.0,
    medium: 2.0,
    hard:   4.0,
  } as Record<QuestDifficulty, number>,

  /** Reward scaling per difficulty (harder quests pay proportionally more). */
  difficultyRewardMult: {
    easy:   1.0,
    medium: 1.3,
    hard:   1.7,
  } as Record<QuestDifficulty, number>,

  // ── Per-type requirement caps & rounding snap ─────────────────────────────

  /**
   * Per quest-type tuning:
   *   max  – hard cap on the requirement value (use Infinity for no cap)
   *   snap – niceRound interval (requirements round to the nearest multiple of this)
   */
  typeSettings: {
    kill_enemies:  { max: Infinity, snap: 5  },
    complete_runs: { max: 15,       snap: 5  },
    reach_floor:   { max: 95,       snap: 1  },
    defeat_bosses: { max: 20,       snap: 5  },
    earn_gold:     { max: Infinity, snap: 50 },
  } as Record<QuestType, { max: number; snap: number }>,

  // ── Reward floor & rounding ───────────────────────────────────────────────

  /** Minimum gold payout for any quest */
  minRewardGold: 50,

  /** Minimum meta-XP payout for any quest */
  minRewardMetaXp: 10,

  /** niceRound snap interval for gold reward values */
  rewardGoldSnap: 25,

  /** niceRound snap interval for meta-XP reward values */
  rewardXpSnap: 5,

}
