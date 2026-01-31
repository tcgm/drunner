import type { RarityConfig } from '@/systems/rarity/types'

export const UNCOMMON: RarityConfig = {
  id: 'uncommon',
  name: 'Uncommon',
  percentage: 0.5,
  color: '#3B82F6',
  backgroundColor: '#1E3A8A',
  statMultiplierBase: 1.5,
  minFloor: 5,
  glow: 'rgba(59, 130, 246, 0.6)',
  text: '#60A5FA',
  textLight: '#DBEAFE',
  bg: 'rgba(59, 130, 246, 0.1)',
  gem: '#3B82F6',
}
