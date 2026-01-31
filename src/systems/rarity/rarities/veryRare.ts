import type { RarityConfig } from '@/systems/rarity/types'

export const VERY_RARE: RarityConfig = {
  id: 'veryRare',
  name: 'Very Rare',
  percentage: 0.05,
  color: '#3e31aa',
  backgroundColor: '#6558cf',
  statMultiplierBase: 2.5,
  minFloor: 15,
}
