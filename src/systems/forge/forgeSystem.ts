/**
 * forgeSystem.ts
 *
 * Pure calculation helpers for the Forge. No Zustand state is read or written here.
 * These functions power UI previews and are also mirrored inline in inventoryActions
 * for atomic store updates.
 */

import { GAME_CONFIG } from '@/config/gameConfig'
import type { ItemRarity } from '@/types'
import type { Material } from '@/data/items/materials'
import { RARITY_ORDER, getRarityIndex, RARITY_CONFIGS } from '@/systems/rarity/raritySystem'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ForgeRecipe {
  materialId: string
  baseType: string
  variantName: string
  targetRarity: ItemRarity
  useStash: boolean
}

export interface AlkahestCostOptions {
  /** Whether to apply the stash discount (useStash = true) */
  fromStash?: boolean
}

// ─── Cost calculation ─────────────────────────────────────────────────────────

/**
 * Returns the alkahest cost to forge an item at `targetRarity` using `material`.
 * Steps = how many rarity tiers above the material's native rarity the target is.
 * If target is at or below native rarity, steps = 0 (no elevation premium).
 */
export function getAlkahestCost(
  material: Material,
  targetRarity: ItemRarity,
  opts: AlkahestCostOptions = {}
): number {
  const { forge } = GAME_CONFIG
  const nativeIdx = getRarityIndex(material.rarity)
  const targetIdx = getRarityIndex(targetRarity)
  const steps = Math.max(0, targetIdx - nativeIdx)

  const rawCost = forge.baseCost * Math.pow(forge.elevation.elevationBase, steps)
  const discount = opts.fromStash ? forge.stashCostMultiplier : 1
  return Math.ceil(rawCost * discount)
}

// ─── Rarity gating ────────────────────────────────────────────────────────────

/**
 * Returns which rarities the player may target for a given material + floor reached.
 * - Native rarity is always in the list.
 * - Higher rarities require `deepestFloor >= minFloor` for that rarity tier.
 * - `forge.respectFloorGate = false` turns off the floor check.
 */
export function getForgeableRarities(material: Material, deepestFloor: number): ItemRarity[] {
  const { forge } = GAME_CONFIG
  const nativeIdx = getRarityIndex(material.rarity)

  return RARITY_ORDER.filter((rarity, idx) => {
    // Must be at or above the material's native rarity
    if (idx < nativeIdx) return false

    // Floor gate
    if (forge.respectFloorGate) {
      const minFloor = (RARITY_CONFIGS as Partial<Record<ItemRarity, { minFloor: number }>>)[rarity]?.minFloor ?? 0
      if (deepestFloor < minFloor) return false
    }

    return true
  })
}

// ─── Recipe validation ────────────────────────────────────────────────────────

/**
 * Validates a forge recipe against current resources.
 * Returns a human-readable error string, or null if valid.
 */
export function validateForgeRecipe(
  recipe: ForgeRecipe,
  currentAlkahest: number,
  materialStash: Record<string, number>,
  deepestFloor: number,
  material: Material,
): string | null {
  // Check target rarity is in forgeable list
  const forgeable = getForgeableRarities(material, deepestFloor)
  if (!forgeable.includes(recipe.targetRarity)) {
    return `Cannot forge at ${recipe.targetRarity} rarity — reach a deeper floor first.`
  }

  // Stash check
  if (recipe.useStash) {
    const available = materialStash[recipe.materialId] ?? 0
    if (available < 1) {
      return `No ${material.name} Fragments in stash.`
    }
  }

  // Alkahest check
  const cost = getAlkahestCost(material, recipe.targetRarity, { fromStash: recipe.useStash })
  if (currentAlkahest < cost) {
    return `Not enough Alkahest (need ${cost}, have ${currentAlkahest}).`
  }

  return null
}

// ─── Breakdown preview ────────────────────────────────────────────────────────

/**
 * Returns how much charge a single item would contribute to its material's meter,
 * before any nexus/research bonuses.
 * Pass the nexus multiplier (e.g. `1 + getNexusBonus(...) / 100`) separately.
 */
export function getBreakdownCharge(
  itemRarity: ItemRarity,
  isUnique: boolean,
  isSet: boolean,
  nexusMultiplier: number = 1,
): number {
  const { breakdown } = GAME_CONFIG.forge
  const base = (breakdown.chargePerRarity as Partial<Record<ItemRarity, number>>)[itemRarity] ?? 0
  const uniqueMult = isUnique && !isSet ? breakdown.uniqueBreakdownMultiplier : 1
  const setMult = isSet ? breakdown.setBreakdownMultiplier : 1
  return Math.floor(base * uniqueMult * setMult * nexusMultiplier)
}

/**
 * Returns how much total charge is needed per fragment for a given material rarity.
 */
export function getBreakdownThreshold(materialRarity: ItemRarity): number {
  const { breakdown } = GAME_CONFIG.forge
  return (breakdown.thresholdByRarity as Partial<Record<ItemRarity, number>>)[materialRarity] ?? Infinity
}
