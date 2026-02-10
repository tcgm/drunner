import type { RarityConfig } from '@/systems/rarity/types'

export const COMMON: RarityConfig = {
  id: 'common',
  name: 'Common',
  percentage: 0.8,
  color: '#86EFAC',        // Green-300 (bright green)
  backgroundColor: '#14532D', // Green-900 (L=0.0454)
  statMultiplierBase: 1.0,
  minFloor: 1,
  glow: 'rgba(134, 239, 172, 0.5)',
  text: '#BBF7D0',         // Green-200
  textLight: '#DCFCE7',    // Green-100
  bg: 'rgba(134, 239, 172, 0.1)',
  gem: '#8EF0B2',          // HSL(142°, 77%, 75%) - bright green
  border: '#86EFAC',
}
