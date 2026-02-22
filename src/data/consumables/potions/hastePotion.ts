import type { Consumable } from '../../../types'
import { GiRun } from 'react-icons/gi'

export const HASTE_POTION: Consumable = {
  id: 'haste-potion',
  name: 'Haste Potion',
  description: 'Increases speed by 35 for 5 events.',
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
      value: 35,
      duration: 5,
      target: 'self',
    }
  ],
  usableInCombat: true,
  usableOutOfCombat: true,
  stackable: true,
  stackCount: 1,
}
