import type { RarityConfig } from '@/systems/rarity/types'

export const VERY_RARE: RarityConfig = {
  id: 'veryRare',
  name: 'Pristine',
  percentage: 0.05,
  color: '#581C87',        // Purple-900 (very dark purple)
  backgroundColor: '#3B0764', // Purple-950 (L=0.0192)
  statMultiplierBase: 2.5,
  minFloor: 15,
  glow: 'rgba(88, 28, 135, 0.5)',
  text: '#A855F7',         // Purple-500
  textLight: '#C084FC',    // Purple-400
  bg: 'rgba(88, 28, 135, 0.1)',
  gem: '#C185F9',          // HSL(271°, 91%, 75%) - bright purple
}
