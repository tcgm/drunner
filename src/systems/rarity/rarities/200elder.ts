import type { RarityConfig } from '@/systems/rarity/types'

export const ELDER: RarityConfig = {
  id: 'elder',
  name: 'Elder',
  percentage: 0.0000005,
  color: '#7F1D1D',        // Red-900 (dark red)
  backgroundColor: '#450A0A', // Red-950 (L=0.0089)
  statMultiplierBase: 18.0,
  minFloor: 93,
  glow: 'rgba(127, 29, 29, 0.6)',
  text: '#DC2626',         // Red-600
  textLight: '#EF4444',    // Red-500
  bg: 'rgba(127, 29, 29, 0.1)',
  gem: '#F98585',          // HSL(0°, 91%, 75%) - bright red
  border: '#7F1D1D',
}
