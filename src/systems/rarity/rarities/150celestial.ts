import type { RarityConfig } from '@/systems/rarity/types'

export const CELESTIAL: RarityConfig = {
  id: 'celestial',
  name: 'Celestial',
  percentage: 0.00002,
  color: '#E0F2FE',        // Sky-100 (very bright sky)
  backgroundColor: '#0C4A6E', // Sky-900 (L=0.0610)
  statMultiplierBase: 8.0,
  minFloor: 70,
  glow: 'rgba(224, 242, 254, 0.6)',
  text: '#F0F9FF',         // Sky-50
  textLight: '#FFFFFF',    // White
  bg: 'rgba(224, 242, 254, 0.1)',
  gem: '#E0F2FE',
  border: '#E0F2FE',
}
