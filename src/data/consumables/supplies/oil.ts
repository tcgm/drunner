import { GiSquareBottle } from 'react-icons/gi'
import type { ConsumableBase } from '../bases/types'

// Oil - lubricates joints and equipment, increases speed
export const OIL_BASE: ConsumableBase = {
  id: 'oil',
  name: 'Oil',
  description: 'Lubricates equipment, increases speed',
  effects: [
    {
      type: 'buff',
      value: 10,
      stat: 'speed',
      duration: 3,
      target: 'self',
    }
  ],
  icon: GiSquareBottle,
  baseGoldValue: 18,
  usableInCombat: false,
  usableOutOfCombat: true,
}
