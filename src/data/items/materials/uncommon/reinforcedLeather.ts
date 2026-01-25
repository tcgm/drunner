import type { Material } from '../index'

export const REINFORCED_LEATHER: Material = {
  id: 'reinforced_leather',
  name: 'Reinforced Leather',
  prefix: 'Reinforced',
  rarity: 'uncommon',
  statMultiplier: 1.4,
  valueMultiplier: 1.8,
  description: 'Enhanced with metal studs',
  blacklist: ['weapon', 'accessory2'] // Leather can't be weapons, amulets, or talismans (but charms are ok)
}
