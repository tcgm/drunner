/**
 * Centralized color definitions for UI consistency
 * Re-exports from GAME_CONFIG for convenience
 */

import { GAME_CONFIG } from './gameConfig'

// Re-export the colors object
export const COLORS = GAME_CONFIG.colors

// Convenience exports for common use cases
export const HP_COLOR = COLORS.hp.base
export const XP_COLOR = COLORS.xp.base
export const GOLD_COLOR = COLORS.gold.base
export const DAMAGE_COLOR = COLORS.damage.base
export const HEAL_COLOR = COLORS.heal.base

// Rarity colors
export const RARITY_COLORS = COLORS.rarity

// Stat colors
export const STAT_COLORS = COLORS.stats
