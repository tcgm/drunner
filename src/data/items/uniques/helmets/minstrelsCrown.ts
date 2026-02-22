import { GiMusicalNotes } from 'react-icons/gi'
import type { Item } from '@/types'

/**
 * Minstrel's Crown - Epic bard helmet
 * Special ability: At combat start, 40% chance to inspire the party with luck-boosting music
 */
export const MINSTRELS_CROWN: Omit<Item, 'id'> = {
  name: "Minstrel's Crown",
  description: "A performer's crown that has graced countless stages and survived countless adventures. It hums with latent ballads and half-remembered battle songs. When battle begins, the wearer's instincts kick in — and the music starts.",
  type: 'helmet',
  rarity: 'epic',
  minRarity: 'uncommon',
  maxRarity: 'legendary',
  icon: GiMusicalNotes,
  stats: {
    charisma: 85,
    luck: 50,
    speed: 25,
    magicPower: 15,
  },
  value: 5000,
}
