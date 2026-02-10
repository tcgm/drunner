import { GiLightningBow } from 'react-icons/gi'
import type { Item } from '@/types'

/**
 * Thunderfury - Epic lightning sword
 */
export const THUNDERFURY: Omit<Item, 'id'> = {
  name: 'Thunderfury, Blessed Blade of the Windseeker',
  description: 'Crackling with elemental fury, this blade channels the raw power of storms.',
  type: 'weapon',
  rarity: 'epic',
  minRarity: 'uncommon',
  maxRarity: 'mythic',
  icon: GiLightningBow,
  stats: {
    attack: 85,
    speed: 20,
    luck: 10,
  },
  value: 5500,
}
