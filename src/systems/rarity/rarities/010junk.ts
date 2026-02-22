import type { RarityConfig } from '@/systems/rarity/types'
import { GiStoneBlock } from 'react-icons/gi'

export const JUNK: RarityConfig = {
  id: 'junk',
  name: 'Junk',
  percentage: 1.0,
  color: '#9CA3AF',        // Gray-400 (medium gray)
  backgroundColor: '#1F2937', // Gray-800 (L=0.0263)
  statMultiplierBase: 0.5,
  minFloor: 0,
  icon: GiStoneBlock,
  glow: 'rgba(156, 163, 175, 0.4)',
  text: '#D1D5DB',         // Gray-300
  textLight: '#E5E7EB',    // Gray-200
  bg: 'rgba(156, 163, 175, 0.1)',
  gem: '#8FB3EF',          // HSL(218°, 75%, 75%) - bright blue-gray
  border: '#9CA3AF',
}
