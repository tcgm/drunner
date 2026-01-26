import type { Item } from '@/types'

/**
 * Shadowweave Cloak Armor - Legendary stealth armor
 */
export const SHADOWWEAVE_CLOAK: Omit<Item, 'id'> = {
  name: 'Shadowweave Cloak',
  description: 'Woven from shadows themselves. Makes the wearer nearly invisible in darkness.',
  type: 'armor',
  rarity: 'legendary',
  stats: {
    defense: 60,
    speed: 40,
    luck: 20,
    attack: 25,
  },
  value: 13000,
}
