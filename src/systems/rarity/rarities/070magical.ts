import type { RarityConfig } from '@/systems/rarity/types'

export const MAGICAL: RarityConfig = {
  id: 'magical',
  name: 'Magical',
  percentage: 0.01,
  color: '#F0ABFC',        // Fuchsia-300 (bright fuchsia)
  backgroundColor: '#701A75', // Fuchsia-900 (L=0.0547)
  statMultiplierBase: 2.8,
  minFloor: 20,
  glow: 'rgba(240, 171, 252, 0.5)',
  text: '#F5D0FE',         // Fuchsia-200
  textLight: '#FAE8FF',    // Fuchsia-100
  bg: 'rgba(240, 171, 252, 0.1)',
  gem: '#F0ABFC',
  border: '#F0ABFC',
}
