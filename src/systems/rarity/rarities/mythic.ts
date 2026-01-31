import type { RarityConfig } from '@/systems/rarity/types'

export const MYTHIC: RarityConfig = {
  id: 'mythic',
  name: 'Mythic',
  percentage: 0.0005,
  color: '#EF4444',
  backgroundColor: '#b3003f',
  statMultiplierBase: 5.0,
  minFloor: 50,
  glow: 'rgba(239, 68, 68, 0.7)',
  text: '#F87171',
  textLight: '#FEE2E2',
  bg: 'rgba(239, 68, 68, 0.1)',
  gem: '#EF4444',
}
