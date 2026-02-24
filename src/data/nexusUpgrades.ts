/**
 * Nexus Upgrades
 * Permanent meta-progression boosts purchased with Meta XP at the Nexus building.
 * Each upgrade has multiple tiers; costs escalate steeply with each tier.
 */
import type { IconType } from 'react-icons'
import {
  GiStarfighter,
  GiTwoCoins,
  GiHeartPlus,
  GiSwordman,
  GiClover  ,
  GiCrystalBall,
  GiSpellBook,
  GiShield,
} from 'react-icons/gi'

export type NexusCategory = 'fortune' | 'combat' | 'resilience' | 'arcane'

export interface NexusUpgrade {
  id: string
  name: string
  /** Description uses {bonus} as a placeholder for the cumulative bonus at each tier */
  description: string
  icon: IconType
  category: NexusCategory
  maxTier: number
  /** Flat bonus added per tier (cumulative) */
  bonusPerTier: number
  /** Display unit after the number, e.g. '%' or '' */
  unit: string
  /** Cost in Meta XP for each tier (index 0 = tier 1 cost) */
  costs: number[]
  color: string
}

export const NEXUS_UPGRADES: NexusUpgrade[] = [
  // ── Fortune ──────────────────────────────────────────────────────────────────
  {
    id: 'gold_find',
    name: 'Gilded Touch',
    description: 'Increases gold dropped by enemies.',
    icon: GiTwoCoins,
    category: 'fortune',
    maxTier: 5,
    bonusPerTier: 3,
    unit: '%',
    costs: [100, 300, 750, 1800, 4200],
    color: '#D4AF37',
  },
  {
    id: 'alkahest_yield',
    name: 'Alchemical Insight',
    description: 'More alkahest recovered from item scrapping.',
    icon: GiCrystalBall,
    category: 'fortune',
    maxTier: 4,
    bonusPerTier: 5,
    unit: '%',
    costs: [200, 600, 1500, 3500],
    color: '#7CDCE4',
  },
  {
    id: 'luck',
    name: 'Keen Fortune',
    description: "Raises all heroes' base Luck stat.",
    icon: GiClover,
    category: 'fortune',
    maxTier: 5,
    bonusPerTier: 1,
    unit: '',
    costs: [150, 400, 1000, 2400, 5500],
    color: '#48BB78',
  },

  // ── Combat ────────────────────────────────────────────────────────────────────
  {
    id: 'xp_gain',
    name: "Veteran's Spirit",
    description: 'All heroes earn more XP from combat and events.',
    icon: GiStarfighter,
    category: 'combat',
    maxTier: 5,
    bonusPerTier: 2,
    unit: '%',
    costs: [100, 280, 700, 1700, 4000],
    color: '#ECC94B',
  },
  {
    id: 'attack_bonus',
    name: 'Battle Hardened',
    description: "Permanently trains all heroes' attack.",
    icon: GiSwordman,
    category: 'combat',
    maxTier: 4,
    bonusPerTier: 1,
    unit: '',
    costs: [350, 900, 2200, 5500],
    color: '#FC8181',
  },

  // ── Resilience ────────────────────────────────────────────────────────────────
  {
    id: 'max_hp',
    name: 'Ironclad Constitution',
    description: 'Increases the maximum HP of all heroes.',
    icon: GiHeartPlus,
    category: 'resilience',
    maxTier: 5,
    bonusPerTier: 5,
    unit: '',
    costs: [120, 350, 850, 2000, 4800],
    color: '#68D391',
  },
  {
    id: 'defense_bonus',
    name: 'Tempered Skin',
    description: "Raises all heroes' base Defense.",
    icon: GiShield,
    category: 'resilience',
    maxTier: 4,
    bonusPerTier: 1,
    unit: '',
    costs: [300, 800, 2000, 5000],
    color: '#90CDF4',
  },

  // ── Arcane ────────────────────────────────────────────────────────────────────
  {
    id: 'magic_bonus',
    name: 'Arcane Resonance',
    description: "Amplifies all heroes' base Magic.",
    icon: GiSpellBook,
    category: 'arcane',
    maxTier: 4,
    bonusPerTier: 1,
    unit: '',
    costs: [300, 800, 2000, 5000],
    color: '#D6BCFA',
  },
]

/** Category display metadata */
export const NEXUS_CATEGORY_META: Record<NexusCategory, { label: string; color: string }> = {
  fortune:    { label: 'Fortune',    color: '#D4AF37' },
  combat:     { label: 'Combat',     color: '#FC8181' },
  resilience: { label: 'Resilience', color: '#68D391' },
  arcane:     { label: 'Arcane',     color: '#D6BCFA' },
}

/**
 * Returns the cumulative numeric bonus for an upgrade given the current tier.
 * E.g. tier 3 of a bonusPerTier=2 upgrade → 6 bonus units.
 */
export function getNexusBonus(upgradeId: string, nexusUpgrades: Record<string, number>): number {
  const upgrade = NEXUS_UPGRADES.find(u => u.id === upgradeId)
  if (!upgrade) return 0
  const tier = nexusUpgrades[upgradeId] ?? 0
  return tier * upgrade.bonusPerTier
}

/**
 * Returns the Meta XP cost for the next tier of an upgrade, or null if already at max tier.
 */
export function getNextTierCost(upgradeId: string, nexusUpgrades: Record<string, number>): number | null {
  const upgrade = NEXUS_UPGRADES.find(u => u.id === upgradeId)
  if (!upgrade) return null
  const currentTier = nexusUpgrades[upgradeId] ?? 0
  if (currentTier >= upgrade.maxTier) return null
  return upgrade.costs[currentTier] // costs[0] = tier-1 cost, costs[1] = tier-2 cost, ...
}
