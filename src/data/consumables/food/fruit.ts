import { GiPear } from 'react-icons/gi'
import type { ConsumableBase } from '../bases/types'

// Fruit - light, refreshing healing
export const FRUIT_BASE: ConsumableBase = {
  id: 'fruit',
  name: 'Fruit',
  description: 'Restores HP',
  effects: [
    {
      type: 'heal',
      value: 35,
      target: 'self',
    }
  ],
  icon: GiPear,
  baseGoldValue: 12,
  usableInCombat: true,
  usableOutOfCombat: true,
}
