import { GiCrystalBall } from 'react-icons/gi'
import type { Item } from '@/types'

/**
 * Orb of Ancient Power - Legendary mage focus orb
 * Special ability: On boss defeat, permanently increases the wearer's magic power.
 */
export const ORB_OF_ANCIENT_POWER: Omit<Item, 'id'> = {
  name: 'Orb of Ancient Power',
  description: 'A perfectly spherical crystal that predates recorded history. Mages believe it is a shard of the first spell ever cast. Holding it feels like touching the origin of all magic.',
  type: 'accessory2',
  rarity: 'legendary',
  minRarity: 'rare',
  maxRarity: 'mythic',
  icon: GiCrystalBall,
  stats: {
    magicPower: 120,
    wisdom: 70,
    charisma: 35,
    luck: 20,
  },
  value: 13500,
}
