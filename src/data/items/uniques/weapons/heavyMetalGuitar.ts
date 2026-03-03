import { GiGuitar } from 'react-icons/gi'
import type { Item } from '@/types'

/**
 * Heavy, Metal Guitar - Unique weapon of ridiculous power and charisma
 * A guitar so unreasonably heavy it could cleave a boulder, yet somehow
 * its thunderous riffs entrance any audience.
 */
export const HEAVY_METAL_GUITAR: Omit<Item, 'id'> = {
  name: 'Heavy, Metal Guitar',
  description: "Forged from pure battlesteel, this guitar weighs as much as a small horse. Swinging it in combat is devastatingly effective. Playing it is equally devastating — to everyone's emotions.",
  type: 'weapon',
  rarity: 'legendary',
  minRarity: 'epic',
  maxRarity: 'artifact',
  icon: GiGuitar,
  stats: {
    attack: 120,
    charisma: 100,
    speed: -20,
    luck: 15,
  },
  value: 12000,
}
