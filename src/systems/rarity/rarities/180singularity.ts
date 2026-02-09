import type { RarityConfig } from '@/systems/rarity/types'

export const SINGULARITY: RarityConfig = {
  id: 'singularity',
  name: 'Singularity',
  percentage: 0.000002,
  color: '#4C1D95',
  backgroundColor: '#2E1065',
  statMultiplierBase: 12.0,
  minFloor: 85,
  glow: 'rgba(76, 29, 149, 0.6)',
  text: '#7C3AED',
  textLight: '#8B5CF6',
  bg: 'rgba(76, 29, 149, 0.1)',
  gem: '#A78BFA',          // Violet-400 (bright)
}
