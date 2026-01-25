import type { Material } from '../index'

export const LEATHER: Material = {
  id: 'leather',
  name: 'Leather',
  prefix: 'Leather',
  rarity: 'common',
  statMultiplier: 1.0,
  valueMultiplier: 1.0,
  description: 'Common leather armor',
  blacklist: ['weapon', 'accessory2'] // Leather can't be weapons, amulets, or talismans (but charms are ok)
}
