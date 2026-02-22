import type { RarityConfig } from '@/systems/rarity/types'
import { GiVortex } from 'react-icons/gi'

export const VOID: RarityConfig = {
  id: 'void',
  name: 'Vorpal',
  percentage: 0.000001,
  color: '#D1D5DB',        // Gray-300 (light gray)
  backgroundColor: '#1F2937', // Gray-800 (L=0.0263)
  statMultiplierBase: 15.0,
  minFloor: 90,
  icon: GiVortex,
  glow: 'rgba(209, 213, 219, 0.5)',
  text: '#E5E7EB',         // Gray-200
  textLight: '#F3F4F6',    // Gray-100
  bg: 'rgba(209, 213, 219, 0.1)',
  gem: '#B8D0F5',          // HSL(216°, 75%, 84%) - bright blue-gray
  border: '#D1D5DB',
}
