import type { RarityConfig } from '@/systems/rarity/types'

export const EPIC: RarityConfig = {
  id: 'epic',
  name: 'Epic',
  percentage: 0.002,
  color: '#FBCFE8',
  backgroundColor: '#831843',
  statMultiplierBase: 3.5,
  minFloor: 30,
  glow: 'rgba(251, 207, 232, 0.5)',
  text: '#FCE7F3',
  textLight: '#FDF2F8',
  bg: 'rgba(251, 207, 232, 0.1)',
  gem: '#FBCFE8',
}
