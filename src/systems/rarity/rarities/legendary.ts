import type { RarityConfig } from '@/systems/rarity/types'

export const LEGENDARY: RarityConfig = {
  id: 'legendary',
  name: 'Legendary',
  percentage: 0.001,
  color: '#F97316',
  backgroundColor: '#b37400',
  statMultiplierBase: 4.0,
  minFloor: 40,
  glow: 'rgba(249, 115, 22, 0.7)',
  text: '#FB923C',
  textLight: '#FED7AA',
  bg: 'rgba(249, 115, 22, 0.1)',
  gem: '#F97316',
}
