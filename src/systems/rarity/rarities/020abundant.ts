import type { RarityConfig } from '@/systems/rarity/types'

export const ABUNDANT: RarityConfig = {
  id: 'abundant',
  name: 'Abundant',
  percentage: 1.0,
  color: '#14532D',        // Green-900 (very dark green)
  backgroundColor: '#052E16', // Green-950 (L=0.0165)
  statMultiplierBase: 0.8,
  minFloor: 0,
  glow: 'rgba(20, 83, 45, 0.5)',
  text: '#22C55E',         // Green-500
  textLight: '#4ADE80',    // Green-400
  bg: 'rgba(20, 83, 45, 0.1)',
  gem: '#8FEFB3',          // HSL(142°, 75%, 75%) - bright green
  border: '#14532D',
}
