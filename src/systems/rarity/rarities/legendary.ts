import type { RarityConfig } from '@/systems/rarity/types'

export const LEGENDARY: RarityConfig = {
  id: 'legendary',
  name: 'Legendary',
  percentage: 0.001,
  color: '#ffa500',
  backgroundColor: '#b37400',
  statMultiplierBase: 4.0,
  minFloor: 40,
}
