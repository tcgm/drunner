import type { RarityConfig } from '@/systems/rarity/types'

export const MYTHIC: RarityConfig = {
  id: 'mythic',
  name: 'Mythic',
  percentage: 0.0005,
  color: '#FEF08A',        // Yellow-200 (very bright gold)
  backgroundColor: '#713F12', // Yellow-900 (L=0.0621)
  statMultiplierBase: 5.0,
  minFloor: 50,
  glow: 'rgba(254, 240, 138, 0.6)',
  text: '#FEF9C3',         // Yellow-100
  textLight: '#FEFCE8',    // Yellow-50
  bg: 'rgba(254, 240, 138, 0.1)',
  gem: '#FEF08A',
  border: '#FEF08A',
}
