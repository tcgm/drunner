import type { RarityConfig } from '@/systems/rarity/types'

export const PLANE: RarityConfig = {
  id: 'plane',
  name: 'Plane',
  percentage: 0.0000001,
  color: '#0C4A6E',        // Sky-900 (dark blue)
  backgroundColor: '#082F49', // Sky-950 (L=0.0285)
  statMultiplierBase: 25.0,
  minFloor: 98,
  glow: 'rgba(12, 74, 110, 0.6)',
  text: '#0EA5E9',         // Sky-500
  textLight: '#38BDF8',    // Sky-400
  bg: 'rgba(12, 74, 110, 0.1)',
  gem: '#84D7FB',          // HSL(198°, 93%, 75%) - bright sky blue
}
