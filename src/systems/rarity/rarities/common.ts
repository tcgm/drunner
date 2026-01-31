import type { RarityConfig } from '@/systems/rarity/types'

export const COMMON: RarityConfig = {
  id: 'common',
  name: 'Common',
  percentage: 0.8,
  color: '#22C55E',
  backgroundColor: '#065F46',
  statMultiplierBase: 1.0,
  minFloor: 1,
  glow: 'rgba(34, 197, 94, 0.6)',
  text: '#4ADE80',
  textLight: '#BBF7D0',
  bg: 'rgba(34, 197, 94, 0.1)',
  gem: '#22C55E',
}
