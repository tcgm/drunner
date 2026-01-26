import { GiCurvyKnife } from 'react-icons/gi'
import type { Item } from '@/types'

/**
 * Shadowfang - Legendary cursed dagger
 */
export const SHADOWFANG: Omit<Item, 'id'> = {
  name: 'Shadowfang',
  description: 'A blade forged in eternal darkness. Whispers of the void emanate from its obsidian surface.',
  type: 'weapon',
  rarity: 'legendary',
  icon: GiCurvyKnife,
  stats: {
    attack: 120,
    speed: 25,
    luck: -5, // Cursed
  },
  value: 8000,
}
