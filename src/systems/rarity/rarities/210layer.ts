import type { RarityConfig } from '@/systems/rarity/types'

export const LAYER: RarityConfig = {
  id: 'layer',
  name: 'Layer',
  percentage: 0.0000002,
  color: '#FDE047',        // Yellow-300 (bright yellow)
  backgroundColor: '#713F12', // Yellow-900 (L=0.0621)
  statMultiplierBase: 20.0,
  minFloor: 96,
  glow: 'rgba(253, 224, 71, 0.6)',
  text: '#FEF08A',         // Yellow-200
  textLight: '#FEF9C3',    // Yellow-100
  bg: 'rgba(253, 224, 71, 0.1)',
  gem: '#FEE981',          // HSL(50°, 98%, 75%) - bright yellow
}
