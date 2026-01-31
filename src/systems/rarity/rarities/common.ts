import type { RarityConfig } from '@/systems/rarity/types'

export const COMMON: RarityConfig = {
  id: 'common',
  name: 'Common',
  percentage: 0.8,
  color: '#ffffff',
  backgroundColor: '#d9d9d9',
  statMultiplierBase: 1.0,
  minFloor: 1,
}
