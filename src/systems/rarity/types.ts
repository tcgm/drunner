import type { ItemRarity } from '@/types'

export interface RarityConfig {
  id: ItemRarity
  name: string
  percentage: number        // Drop rate / occurrence
  color: string            // Text color
  backgroundColor: string  // Background color
  statMultiplierBase: number  // Base stat multiplier for materials
  minFloor: number         // Minimum floor for this rarity
}

export type { ItemRarity }
