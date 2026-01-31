import type { RarityConfig } from '@/systems/rarity/types'

export const RARE: RarityConfig = {
  id: 'rare',
  name: 'Rare',
  percentage: 0.2,
  color: '#A855F7',
  backgroundColor: '#581C87',
  statMultiplierBase: 2.0,
  minFloor: 10,
  glow: 'rgba(168, 85, 247, 0.6)',
  text: '#C084FC',
  textLight: '#E9D5FF',
  bg: 'rgba(168, 85, 247, 0.1)',
  gem: '#A855F7',
}
