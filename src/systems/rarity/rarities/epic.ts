import type { RarityConfig } from '@/systems/rarity/types'

export const EPIC: RarityConfig = {
  id: 'epic',
  name: 'Epic',
  percentage: 0.002,
  color: '#ffd700',
  backgroundColor: '#b39700',
  statMultiplierBase: 3.5,
  minFloor: 30,
}
