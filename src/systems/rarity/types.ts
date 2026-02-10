import type { ItemRarity } from '@/types'

export interface RarityConfig {
  id: ItemRarity
  name: string
  percentage: number        // Drop rate / occurrence
  color: string            // Primary border/text color (hex)
  backgroundColor: string  // Background color (hex)
  statMultiplierBase: number  // Base stat multiplier for materials
  minFloor: number         // Minimum floor for this rarity
  // Additional UI colors
  glow?: string            // Glow effect color with opacity (rgba)
  text?: string            // Text color (hex)
  textLight?: string       // Light text color (hex)
  bg?: string              // Background with opacity (rgba)
  gem?: string             // Gem/icon color (hex)
  border?: string          // Border color (hex)
}

export type { ItemRarity }
