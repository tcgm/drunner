import type { RarityConfig } from '@/systems/rarity/types'

export const MYTHICC: RarityConfig = {
  id: 'mythicc',
  name: 'Mythicc',
  percentage: 0.0002,
  color: '#7F1D1D',
  backgroundColor: '#450A0A',
  statMultiplierBase: 5.5,
  minFloor: 55,
  glow: 'rgba(127, 29, 29, 0.5)',
  text: '#DC2626',
  textLight: '#EF4444',
  bg: 'rgba(127, 29, 29, 0.1)',
  gem: '#F98585',          // HSL(0°, 91%, 75%) - bright red
}
