import type { RarityConfig } from '@/systems/rarity/types'

export const ARTIFACT: RarityConfig = {
  id: 'artifact',
  name: 'Artifact',
  percentage: 0.0001,
  color: '#EAB308',
  backgroundColor: '#705107',
  statMultiplierBase: 6.0,
  minFloor: 60,
  glow: 'rgba(234, 179, 8, 0.7)',
  text: '#FACC15',
  textLight: '#FEF3C7',
  bg: 'rgba(234, 179, 8, 0.1)',
  gem: '#EAB308',
}
