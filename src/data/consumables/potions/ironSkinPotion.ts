import type { Consumable } from '../../../types'
import { GiShield } from 'react-icons/gi'

export const IRON_SKIN_POTION: Consumable = {
  id: 'iron-skin-potion',
  name: 'Iron Skin Potion',
  description: 'Increases defense by 8 for 5 events.',
  type: 'consumable',
  rarity: 'uncommon',
  stats: {},
  value: 75,
  icon: GiShield,
  consumableType: 'potion',
  effects: [
    {
      type: 'buff',
      stat: 'defense',
      value: 8,
      duration: 5,
      target: 'self',
    }
  ],
  usableInCombat: false,
  usableOutOfCombat: true,
  stackable: true,
  stackCount: 1,
}
