import { GiDramaMasks } from 'react-icons/gi'
import type { Item } from '@/types'

/**
 * Jester's Motley - Rare bard armor
 * A trickster's garb that blurs the line between performer and survivor.
 */
export const JESTERS_MOTLEY: Omit<Item, 'id'> = {
  name: "Jester's Motley",
  description: "Patchwork armor disguised as a court jester's costume. Enemies underestimate the wearer, granting uncanny agility. Laughter is the best defense - and offense.",
  type: 'armor',
  rarity: 'rare',
  minRarity: 'uncommon',
  maxRarity: 'legendary',
  icon: GiDramaMasks,
  stats: {
    charisma: 50,
    speed: 45,
    luck: 35,
    defense: 20,
  },
  value: 2800,
}
