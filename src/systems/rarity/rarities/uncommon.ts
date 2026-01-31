import type { RarityConfig } from '@/systems/rarity/types'

export const UNCOMMON: RarityConfig = {
  id: 'uncommon',
  name: 'Uncommon',
  percentage: 0.5,
  color: '#31aa3e',
  backgroundColor: '#206f28',
  statMultiplierBase: 1.5,
  minFloor: 5,
}
