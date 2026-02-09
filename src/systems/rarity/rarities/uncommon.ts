import type { RarityConfig } from '@/systems/rarity/types'

export const UNCOMMON: RarityConfig = {
  id: 'uncommon',
  name: 'Uncommon',
  percentage: 0.5,
  color: '#1E3A8A',        // Blue-900 (dark blue)
  backgroundColor: '#1E293B', // Slate-800 (L=0.0407)
  statMultiplierBase: 1.5,
  minFloor: 5,
  glow: 'rgba(30, 58, 138, 0.5)',
  text: '#3B82F6',         // Blue-500
  textLight: '#60A5FA',    // Blue-400
  bg: 'rgba(30, 58, 138, 0.1)',
  gem: '#1E3A8A',
}
