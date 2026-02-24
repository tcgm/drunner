/**
 * Nexus upgrade registry
 *
 * Re-exports all individual upgrade definitions, assembles the canonical
 * NEXUS_UPGRADES list used by the store and UI, and provides utility helpers.
 *
 * To add a new upgrade: create a file in this folder, export a typed const,
 * then add it to the NEXUS_UPGRADES array below.
 */

export type { NexusCategory, NexusUpgrade } from './types'
export { NEXUS_CATEGORY_META, NEXUS_CATEGORY_ORDER } from './config'

// Fortune
export { GOLD_FIND } from './goldFind'
export { ALKAHEST_YIELD } from './alkahestYield'
export { LUCK_BOOST } from './luck'

// Combat
export { XP_GAIN } from './xpGain'
export { ATTACK_BONUS } from './attackBonus'

// Resilience
export { MAX_HP_BOOST } from './maxHp'
export { DEFENSE_BONUS } from './defenseBonus'

// Arcane
export { MAGIC_BONUS } from './magicBonus'

import type { NexusUpgrade } from './types'
import { GOLD_FIND } from './goldFind'
import { ALKAHEST_YIELD } from './alkahestYield'
import { LUCK_BOOST } from './luck'
import { XP_GAIN } from './xpGain'
import { ATTACK_BONUS } from './attackBonus'
import { MAX_HP_BOOST } from './maxHp'
import { DEFENSE_BONUS } from './defenseBonus'
import { MAGIC_BONUS } from './magicBonus'

/** All registered Nexus upgrades in display order */
export const NEXUS_UPGRADES: NexusUpgrade[] = [
  // Fortune
  GOLD_FIND,
  ALKAHEST_YIELD,
  LUCK_BOOST,
  // Combat
  XP_GAIN,
  ATTACK_BONUS,
  // Resilience
  MAX_HP_BOOST,
  DEFENSE_BONUS,
  // Arcane
  MAGIC_BONUS,
]

/**
 * Returns the cumulative numeric bonus for an upgrade given the player's current tier.
 * E.g. tier 3 of a bonusPerTier=2 upgrade → +6.
 */
export function getNexusBonus(upgradeId: string, nexusUpgrades: Record<string, number>): number {
  const upgrade = NEXUS_UPGRADES.find(u => u.id === upgradeId)
  if (!upgrade) return 0
  const tier = nexusUpgrades[upgradeId] ?? 0
  return tier * upgrade.bonusPerTier
}

/**
 * Returns the Meta XP cost for the next tier, or null if the upgrade is already maxed.
 * costs[0] = cost to reach tier 1, costs[1] = cost to reach tier 2, etc.
 */
export function getNextTierCost(upgradeId: string, nexusUpgrades: Record<string, number>): number | null {
  const upgrade = NEXUS_UPGRADES.find(u => u.id === upgradeId)
  if (!upgrade) return null
  const currentTier = nexusUpgrades[upgradeId] ?? 0
  if (currentTier >= upgrade.maxTier) return null
  return upgrade.costs[currentTier]
}
