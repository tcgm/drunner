/**
 * Nexus upgrade registry
 *
 * Re-exports all individual upgrade definitions, assembles the canonical
 * NEXUS_UPGRADES list used by the store and UI, and provides utility helpers.
 *
 * To add a new upgrade: create a file in this folder, export a typed const,
 * then add it to the NEXUS_UPGRADES array below.
 *
 * Cost formula (per tier):
 *   cost = baseCost * rarityMagnitudeMultiplier^rarityIndex * tierWithinRarity^intraRarityExponent * costMultiplier
 *
 * Where rarityIndex is 0-based position in GAME_CONFIG.nexus.rarityProgression,
 * and tierWithinRarity is 1-based position within that rarity phase.
 */

import type { ItemRarity, Stats } from '@/types'
import { GAME_CONFIG } from '@/config/gameConfig'
import { RARITY_CONFIGS } from '@/systems/rarity/raritySystem'

// ─── Global nexus context ──────────────────────────────────────────────────────
// Populated by the store on load / after purchases so game systems can read it
// without prop-drilling (statCalculator, eventResolver, bossStats, inventoryActions).
let _activeNexusUpgrades: Record<string, number> = {}

/** Called by the store after rehydration and after each purchase. */
export function setActiveNexusUpgrades(nu: Record<string, number>): void {
  _activeNexusUpgrades = nu
}

/** Returns the current nexus upgrade context used by game systems. */
export function getActiveNexusUpgrades(): Record<string, number> {
  return _activeNexusUpgrades
}

export type { NexusCategory, NexusUpgrade } from './types'
export { NEXUS_CATEGORY_META, NEXUS_CATEGORY_ORDER } from './config'

// Fortune
export { GOLD_FIND } from './goldFind'
export { ALKAHEST_YIELD } from './alkahestYield'
export { LUCK_BOOST } from './luck'

// Combat
export { XP_GAIN } from './xpGain'
export { ATTACK_BONUS } from './attackBonus'
export { BOSS_HP_REDUCTION } from './bossHpReduction'

// Resilience
export { MAX_HP_BOOST } from './maxHp'
export { DEFENSE_BONUS } from './defenseBonus'

// Arcane
export { MAGIC_BONUS } from './magicBonus'
export { FORGE_BREAKDOWN_EFFICIENCY } from './forgeBreakdownEfficiency'

import type { NexusUpgrade } from './types'
import { GOLD_FIND } from './goldFind'
import { ALKAHEST_YIELD } from './alkahestYield'
import { LUCK_BOOST } from './luck'
import { XP_GAIN } from './xpGain'
import { ATTACK_BONUS } from './attackBonus'
import { BOSS_HP_REDUCTION } from './bossHpReduction'
import { MAX_HP_BOOST } from './maxHp'
import { DEFENSE_BONUS } from './defenseBonus'
import { MAGIC_BONUS } from './magicBonus'
import { FORGE_BREAKDOWN_EFFICIENCY } from './forgeBreakdownEfficiency'

/** All registered Nexus upgrades in display order */
export const NEXUS_UPGRADES: NexusUpgrade[] = [
  // Fortune
  GOLD_FIND,
  ALKAHEST_YIELD,
  LUCK_BOOST,
  FORGE_BREAKDOWN_EFFICIENCY,
  // Combat
  XP_GAIN,
  ATTACK_BONUS,
  BOSS_HP_REDUCTION,
  // Resilience
  MAX_HP_BOOST,
  DEFENSE_BONUS,
  // Arcane
  MAGIC_BONUS,
]

// ─── Tier breakdown ───────────────────────────────────────────────────────────

/** Describes where a player's total purchased tiers sit within the rarity progression. */
export interface NexusTierBreakdown {
  /** Total tiers purchased so far for this upgrade */
  absoluteTier: number
  /** 0-based index into GAME_CONFIG.nexus.rarityProgression for the current rarity phase */
  rarityIndex: number
  /** The current rarity phase ID, e.g. 'uncommon' */
  rarityId: ItemRarity
  /** Display name of the current rarity phase from the rarity system */
  rarityName: string
  /** Primary hex color for the current rarity phase */
  rarityColor: string
  /** How many tiers the player has completed within the current rarity phase (0-based count) */
  tierWithinRarity: number
  /** Total tiers per rarity phase (from config) */
  tiersPerRarity: number
  /** Whether all rarity phases are fully completed */
  isMaxed: boolean
  /** Theoretical maximum absolute tiers: tiersPerRarity × rarityProgression.length */
  totalMax: number
}

export function getNexusTierBreakdown(
  upgradeId: string,
  nexusUpgrades: Record<string, number>,
): NexusTierBreakdown {
  const { tiersPerRarity, rarityProgression } = GAME_CONFIG.nexus
  const totalMax = tiersPerRarity * rarityProgression.length
  const absoluteTier = Math.min(nexusUpgrades[upgradeId] ?? 0, totalMax)
  const isMaxed = absoluteTier >= totalMax

  // Which rarity phase we're currently IN (clamped so that being fully maxed stays at last phase)
  const rarityIndex = Math.min(
    Math.floor(absoluteTier / tiersPerRarity),
    rarityProgression.length - 1,
  )
  // How many tiers have been completed within the current phase
  // Special case: if isMaxed, all tiersPerRarity in the last phase are done
  const tierWithinRarity = isMaxed ? tiersPerRarity : absoluteTier % tiersPerRarity

  const rarityId = rarityProgression[rarityIndex] as ItemRarity
  const rarityConfig = RARITY_CONFIGS[rarityId]

  return {
    absoluteTier,
    rarityIndex,
    rarityId,
    rarityName: rarityConfig?.name ?? rarityId,
    rarityColor: rarityConfig?.color ?? '#888888',
    tierWithinRarity,
    tiersPerRarity,
    isMaxed,
    totalMax,
  }
}

// ─── Cost formula ─────────────────────────────────────────────────────────────

/**
 * Returns the Meta XP cost for the NEXT tier purchase, or null if fully maxed.
 *
 * Formula: baseCost * magnitudeMultiplier^rarityIndex * tierWithinRarity^intraRarityExponent * costMultiplier
 * where tierWithinRarity is 1-based (the tier the player is buying INTO within that phase).
 */
export function getNextTierCost(
  upgradeId: string,
  nexusUpgrades: Record<string, number>,
): number | null {
  const upgrade = NEXUS_UPGRADES.find(u => u.id === upgradeId)
  if (!upgrade) return null

  const { tiersPerRarity, rarityProgression, intraRarityExponent, rarityMagnitudeMultiplier, costMultiplier } = GAME_CONFIG.nexus
  const totalTiers = nexusUpgrades[upgradeId] ?? 0
  const totalMax = tiersPerRarity * rarityProgression.length
  if (totalTiers >= totalMax) return null

  // Which rarity phase the NEXT tier falls into
  const nextRarityIndex = Math.floor(totalTiers / tiersPerRarity)
  // 1-based position within that phase (1 = first tier of this phase)
  const nextTierWithinRarity = (totalTiers % tiersPerRarity) + 1

  const rawCost =
    upgrade.baseCost *
    Math.pow(rarityMagnitudeMultiplier, nextRarityIndex) *
    Math.pow(nextTierWithinRarity, intraRarityExponent) *
    costMultiplier

  return Math.round(rawCost)
}

// ─── Bonus helper ─────────────────────────────────────────────────────────────

/**
 * Returns the total cumulative bonus for an upgrade given the player's purchased tiers.
 * Scales linearly: every tier regardless of rarity phase contributes bonusPerTier.
 * Apply GAME_CONFIG.nexus.bonusMultiplier for global tuning.
 */
export function getNexusBonus(upgradeId: string, nexusUpgrades: Record<string, number>): number {
  const upgrade = NEXUS_UPGRADES.find(u => u.id === upgradeId)
  if (!upgrade) return 0
  const totalTiers = nexusUpgrades[upgradeId] ?? 0
  return Math.round(totalTiers * upgrade.bonusPerTier * GAME_CONFIG.nexus.bonusMultiplier)
}

/**
 * Returns flat stat bonuses applied to every hero from nexus upgrades.
 * Used by calculateTotalStats as an additional modifier layer.
 */
export function getNexusStatModifiers(nexusUpgrades: Record<string, number>): Partial<Stats> {
  return {
    attack: getNexusBonus('attack_bonus', nexusUpgrades),
    defense: getNexusBonus('defense_bonus', nexusUpgrades),
    maxHp: getNexusBonus('max_hp', nexusUpgrades),
    luck: getNexusBonus('luck', nexusUpgrades),
    magicPower: getNexusBonus('magic_bonus', nexusUpgrades),
  }
}

