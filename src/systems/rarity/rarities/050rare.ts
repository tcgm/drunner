import type { RarityConfig } from '@/systems/rarity/types'

export const RARE: RarityConfig = {
  id: 'rare',
  name: 'Rare',
  percentage: 0.2,
  color: '#C084FC',        // Purple-400 (light purple)
  backgroundColor: '#581C87', // Purple-900 (L=0.0465)
  statMultiplierBase: 2.0,
  minFloor: 10,
  glow: 'rgba(192, 132, 252, 0.5)',
  text: '#E9D5FF',         // Purple-200
  textLight: '#F3E8FF',    // Purple-100
  bg: 'rgba(192, 132, 252, 0.1)',
  gem: '#C084FC',
}
