import { GiFoxHead } from 'react-icons/gi'
import type { Item } from '@/types'

/**
 * Kitsune's Soul - Set accessory (amulet)
 */
export const KITSUNE_SOUL: Omit<Item, 'id'> = {
  name: "Kitsune's Soul",
  description: 'An amulet holding the blessing of the nine-tailed fox. Grants mystical resilience.',
  type: 'accessory2',
  rarity: 'set',
  icon: GiFoxHead,
  stats: {
    maxHp: 80,
    luck: 25,
    magicPower: 30,
    defense: 20,
  },
  value: 6500,
}
