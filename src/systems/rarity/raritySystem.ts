/**
 * Extended rarity system for enhanced progression
 * Merged from external rarity library with dungeon runner's material system
 */

import type { ItemRarity } from '@/types'
import type { RarityConfig } from './types'
import * as Rarities from './rarities'

// Build RARITY_CONFIGS from individual rarity files
export const RARITY_CONFIGS: Record<ItemRarity, RarityConfig> = {
  junk: Rarities.JUNK,
  abundant: Rarities.ABUNDANT,
  common: Rarities.COMMON,
  uncommon: Rarities.UNCOMMON,
  rare: Rarities.RARE,
  veryRare: Rarities.VERY_RARE,
  magical: Rarities.MAGICAL,
  elite: Rarities.ELITE,
  epic: Rarities.EPIC,
  legendary: Rarities.LEGENDARY,
  mythic: Rarities.MYTHIC,
  mythicc: Rarities.MYTHICC,
  artifact: Rarities.ARTIFACT,
  divine: Rarities.DIVINE,
  celestial: Rarities.CELESTIAL,
  realityAnchor: Rarities.REALITY_ANCHOR,
  structural: Rarities.STRUCTURAL,
  singularity: Rarities.SINGULARITY,
  void: Rarities.VOID,
  elder: Rarities.ELDER,
  layer: Rarities.LAYER,
  plane: Rarities.PLANE,
  author: Rarities.AUTHOR,
}

export function getRarityConfig(rarity: ItemRarity): RarityConfig {
  return RARITY_CONFIGS[rarity]
}

export function getRarityColor(rarity: ItemRarity): string {
  return RARITY_CONFIGS[rarity].color
}

export function getRarityBackgroundColor(rarity: ItemRarity): string {
  return RARITY_CONFIGS[rarity].backgroundColor
}

export function guessRarity(inputString: string): ItemRarity {
  if (!inputString) return 'abundant'

  const normalized = inputString.replace(/[\s_-]/g, '').toLowerCase()
  
  for (const [key, config] of Object.entries(RARITY_CONFIGS)) {
    const normalizedRarity = config.id.replace(/[\s_-]/g, '').toLowerCase()
    if (normalized === normalizedRarity) {
      return key as ItemRarity
    }
  }
  
  return 'abundant'
}

export function getRaritiesForFloor(floor: number): ItemRarity[] {
  return Object.entries(RARITY_CONFIGS)
    .filter(([_, config]) => floor >= config.minFloor)
    .map(([rarity]) => rarity as ItemRarity)
}
