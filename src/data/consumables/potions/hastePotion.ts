import type { Consumable } from '../../../types'
import { GiRun } from 'react-icons/gi'

export const HASTE_POTION: Consumable = {
  id: 'haste-potion',
  name: 'Haste Potion',
  description: 'Increases speed by 12 for 5 events.',
  type: 'consumable',
  rarity: 'uncommon',
  stats: {},
  value: 75,
  icon: GiRun,
  consumableType: 'potion',
  effects: [
    {
      type: 'buff',
      stat: 'speed',
      value: 12,
      duration: 5,
      target: 'self',
    }
  ],
  usableInCombat: false,
  usableOutOfCombat: true,
  stackable: true,
  stackCount: 1,
}
