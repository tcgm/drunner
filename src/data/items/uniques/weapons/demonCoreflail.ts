import type { Item } from '@/types'
import demonCoreflailLight from '@/assets/icons/items/demonCoreflailLight.svg'

/**
 * Demon Coreflail - Legendary cursed weapon of mass destruction
 * Unique effect registered in UNIQUE_ITEM_EFFECTS by name
 */
export const DEMON_COREFLAIL: Omit<Item, 'id'> = {
  name: 'Demon Coreflail',
  description: 'Some absolute madman mounted a subcritical sphere of pure destructive energy to a chain. It emits an eerie blue glow and makes your teeth ache. Horrifyingly effective. Probably lethal to wield.',
  type: 'weapon',
  rarity: 'legendary',
  icon: demonCoreflailLight,
  stats: {
    attack: 165, // Incredibly powerful
    magicPower: 45, // Radiates energy
    maxHp: -25, // Actively harmful to your health
    luck: -15, // This is a TERRIBLE idea
  },
  value: 12000,
  modifiers: ['cursed'],
}
