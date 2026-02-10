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

// Build RARITY_COLORS from individual rarity configs for UI components
// This provides the same interface as the old rarityColors.ts file
export interface RarityColorScheme {
  /** Primary border/text color (hex) */
  color: string
  /** Background color (hex) */
  backgroundColor: string
  /** Glow effect color with opacity (rgba) */
  glow: string
  /** Primary text color (hex) - usually lighter than border */
  text: string
  /** Light text variant (hex) - for emphasized text */
  textLight: string
  /** Background with opacity (rgba) - for containers */
  bg: string
  /** Gem/icon color (hex) - usually matches primary color */
  gem: string
  /** Border color (hex) - usually matches primary color */
  border: string
}

export const RARITY_COLORS: Record<string, RarityColorScheme> = {
  // Build from rarity configs
  ...Object.fromEntries(
    Object.entries(RARITY_CONFIGS).map(([key, config]) => [
      key,
      {
        color: config.color,
        backgroundColor: config.backgroundColor,
        glow: config.glow || 'rgba(74, 85, 104, 0.4)',
        text: config.text || config.color,
        textLight: config.textLight || config.text || config.color,
        bg: config.bg || `rgba(74, 85, 104, 0.1)`,
        gem: config.gem || config.color,
        border: config.border || config.color,
      },
    ])
  ),
  // Special item types (not rarities but need colors)
  set: {
    color: '#14B8A6',        // Teal-500
    backgroundColor: '#134E4A', // Teal-900
    glow: 'rgba(20, 184, 166, 0.5)',
    text: '#5EEAD4',         // Teal-300
    textLight: '#CCFBF1',    // Teal-100
    bg: 'rgba(20, 184, 166, 0.1)',
    gem: '#8CF2E6',          // HSL(173°, 80%, 75%) - bright teal
    border: '#14B8A6',
  },
  cursed: {
    color: '#4B5563',        // Gray-600
    backgroundColor: '#111827', // Gray-900
    glow: 'rgba(75, 85, 99, 0.4)',
    text: '#6B7280',         // Gray-500
    textLight: '#9CA3AF',    // Gray-400
    bg: 'rgba(75, 85, 99, 0.1)',
    gem: '#8FB7EF',          // HSL(215°, 75%, 75%) - bright blue-gray
    border: '#4B5563',
  },
  // Special UI states
  unique: {
    color: '#FFD700',        // Gold
    backgroundColor: '#000000', // Black
    glow: 'rgba(255, 215, 0, 0.5)',
    text: '#FFD700',
    textLight: '#FFD700',
    bg: 'rgba(255, 215, 0, 0.1)',
    gem: '#FFD700',
    border: '#FFD700',
  },
  selected: {
    color: '#60A5FA',        // Blue-400
    backgroundColor: '#1E3A8A', // Blue-900
    glow: 'rgba(96, 165, 250, 0.8)',
    text: '#60A5FA',
    textLight: '#93C5FD',    // Blue-300
    bg: 'rgba(96, 165, 250, 0.1)',
    gem: '#60A5FA',
    border: '#60A5FA',
  },
}

// Helper functions for accessing color properties
export function getRarityColors(rarity: string): RarityColorScheme {
  return RARITY_COLORS[rarity] || RARITY_COLORS.junk
}

export function getRarityGlow(rarity: string): string {
  return RARITY_COLORS[rarity]?.glow || RARITY_COLORS.junk.glow
}

// Enable HMR for individual rarity file changes - accept without invalidating self
if (import.meta.hot) {
  // Self-accept to prevent propagating invalidation to importers
  import.meta.hot.accept(() => {
    console.log('🔄 Rarity system accepted HMR update')
  })
}
