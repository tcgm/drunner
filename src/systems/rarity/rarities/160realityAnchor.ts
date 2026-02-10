import type { RarityConfig } from '@/systems/rarity/types'

export const REALITY_ANCHOR: RarityConfig = {
  id: 'realityAnchor',
  name: 'Anchor',
  percentage: 0.00001,
  color: '#312E81',
  backgroundColor: '#1E1B4B',
  statMultiplierBase: 9.0,
  minFloor: 75,
  glow: 'rgba(49, 46, 129, 0.6)',
  text: '#6366F1',
  textLight: '#818CF8',
  bg: 'rgba(49, 46, 129, 0.1)',
  gem: '#8792F8',          // HSL(234°, 89%, 75%) - bright indigo
  border: '#312E81',
}
