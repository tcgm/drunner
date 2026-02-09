import type { RarityConfig } from '@/systems/rarity/types'

export const ELITE: RarityConfig = {
  id: 'elite',
  name: 'Elite',
  percentage: 0.005,
  color: '#881337',
  backgroundColor: '#4C0519',
  statMultiplierBase: 3.0,
  minFloor: 25,
  glow: 'rgba(136, 19, 55, 0.5)',
  text: '#E11D48',
  textLight: '#F43F5E',
  bg: 'rgba(136, 19, 55, 0.1)',
  gem: '#FC8395',          // HSL(351°, 95%, 75%) - bright rose
}
