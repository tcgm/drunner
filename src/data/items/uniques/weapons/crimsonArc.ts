import type { Item } from '@/types'
import crimsonArcSvg from '@/assets/icons/items/crimsonArc.svg'

/**
 * Crimson Arc - Mythic high-velocity scythe of unknown origin
 * Unique effect registered in UNIQUE_ITEM_EFFECTS by name
 */
export const CRIMSON_ARC: Omit<Item, 'id'> = {
  name: 'Crimson Arc',
  description: 'A sleek, collapsible war-scythe of mysterious origin, its blade the deep red of a dying rose. Rumor has it the weapon also functions as a high-caliber sniper rifle, though no one has been able to confirm this and lived to tell the tale. Moves in a blur of crimson petals.',
  type: 'weapon',
  rarity: 'legendary',
  minRarity: 'epic',
  maxRarity: 'mythic',
  icon: crimsonArcSvg,
  stats: {
    attack: 175,
    speed: 50,
    luck: 10,
  },
  value: 14500,
}
