import { GiFrozenBlock } from 'react-icons/gi'
import type { Item } from '@/types'

/**
 * Icebound Relic - Mythic frozen accessory
 */
export const ICEBOUND_RELIC: Omit<Item, 'id'> = {
  name: 'Icebound Relic',
  description: 'An ancient artifact frozen in time. Its glacial power slows enemies and grants the wearer unshakable defense.',
  type: 'accessory1',
  rarity: 'mythic',
  minRarity: 'epic',
  maxRarity: 'divine',
  icon: GiFrozenBlock,
  stats: {
    defense: 120,
    maxHp: 150,
    speed: -15, // Heavy and cold
    wisdom: 80,
  },
  value: 30000,
}
