import type { RarityConfig } from '@/systems/rarity/types'

export const STRUCTURAL: RarityConfig = {
  id: 'structural',
  name: 'Structural',
  percentage: 0.000005,
  color: '#DDD6FE',        // Violet-200 (bright violet)
  backgroundColor: '#4C1D95', // Violet-900 (L=0.0459)
  statMultiplierBase: 10.0,
  minFloor: 80,
  glow: 'rgba(221, 214, 254, 0.6)',
  text: '#EDE9FE',         // Violet-100
  textLight: '#F5F3FF',    // Violet-50
  bg: 'rgba(221, 214, 254, 0.1)',
  gem: '#DDD6FE',
  border: '#DDD6FE',
}
