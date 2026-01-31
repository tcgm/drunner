import type { RarityConfig } from '@/systems/rarity/types'

export const ELITE: RarityConfig = {
  id: 'elite',
  name: 'Elite',
  percentage: 0.005,
  color: '#DB2777',
  backgroundColor: '#561d51',
  statMultiplierBase: 3.0,
  minFloor: 25,
  glow: 'rgba(219, 39, 119, 0.6)',
  text: '#F472B6',
  textLight: '#FCE7F3',
  bg: 'rgba(219, 39, 119, 0.1)',
  gem: '#DB2777',
}
