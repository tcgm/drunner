import type { RarityConfig } from '@/systems/rarity/types'

export const MYTHIC: RarityConfig = {
  id: 'mythic',
  name: 'Mythic',
  percentage: 0.0005,
  color: '#ff005a',
  backgroundColor: '#b3003f',
  statMultiplierBase: 5.0,
  minFloor: 50,
}
