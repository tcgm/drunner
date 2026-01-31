import type { RarityConfig } from '@/systems/rarity/types'

export const EPIC: RarityConfig = {
  id: 'epic',
  name: 'Epic',
  percentage: 0.002,
  color: '#EC4899',
  backgroundColor: '#b39700',
  statMultiplierBase: 3.5,
  minFloor: 30,
  glow: 'rgba(236, 72, 153, 0.6)',
  text: '#F472B6',
  textLight: '#FCE7F3',
  bg: 'rgba(236, 72, 153, 0.1)',
  gem: '#EC4899',
}
