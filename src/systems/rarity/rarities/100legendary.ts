import type { RarityConfig } from '@/systems/rarity/types'

export const LEGENDARY: RarityConfig = {
  id: 'legendary',
  name: 'Legendary',
  percentage: 0.001,
  color: '#92400E',        // Amber-900 (dark amber)
  backgroundColor: '#431407', // Orange-950 (L=0.0109)
  statMultiplierBase: 4.0,
  minFloor: 40,
  glow: 'rgba(146, 64, 14, 0.5)',
  text: '#F59E0B',         // Amber-500
  textLight: '#FBBF24',    // Amber-400
  bg: 'rgba(146, 64, 14, 0.1)',
  gem: '#FCDA82',          // HSL(43°, 96%, 75%) - bright amber
  border: '#92400E',
}
