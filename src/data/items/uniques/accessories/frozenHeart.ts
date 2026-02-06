import { GiCrystalBars } from 'react-icons/gi'
import type { Item } from '@/types'
// import { RaFrozenHeart } from '@/components/icons/RpgIcons' // Icon missing from font

/**
 * Frozen Heart - Mythic ice accessory
 */
export const FROZEN_HEART: Omit<Item, 'id'> = {
  name: 'Frozen Heart',
  description: 'A heart encased in eternal ice. Its cold touch slows enemies and fortifies the bearer with unbreakable resolve.',
  type: 'accessory1',
  rarity: 'mythic',
  icon: GiCrystalBars, // Using fallback icon until ice-crystal is available
  stats: {
    defense: 120,
    maxHp: 150,
    speed: -15, // Heavy and cold
    wisdom: 80,
  },
  value: 30000,
}
