import type { RarityConfig } from '@/systems/rarity/types'

export const DIVINE: RarityConfig = {
  id: 'divine',
  name: 'Divine',
  percentage: 0.00005,
  color: '#0E7490',        // Cyan-700 (dark cyan)
  backgroundColor: '#083344', // Cyan-950 (L=0.0217)
  statMultiplierBase: 7.0,
  minFloor: 65,
  glow: 'rgba(14, 116, 144, 0.6)',
  text: '#06B6D4',         // Cyan-500
  textLight: '#22D3EE',    // Cyan-400
  bg: 'rgba(14, 116, 144, 0.1)',
  gem: '#88E7F6',          // HSL(188°, 86%, 75%) - bright cyan
}
