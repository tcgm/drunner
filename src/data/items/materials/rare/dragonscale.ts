import type { Material } from '../index'

export const DRAGONSCALE: Material = {
  id: 'dragonscale',
  name: 'Dragonscale',
  prefix: 'Dragonscale',
  rarity: 'rare',
  statMultiplier: 2.2,
  valueMultiplier: 5.0,
  description: 'Harvested from dragon hide',
  blacklist: ['weapon', 'accessory2'] // Scales are for armor, not weapons or rigid accessories (but charms ok)
}
