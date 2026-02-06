import { GiStoneWheel } from 'react-icons/gi'
import type { ConsumableBase } from '../bases/types'

// Whetstone - sharpens weapons, increases attack
export const WHETSTONE_BASE: ConsumableBase = {
  id: 'whetstone',
  name: 'Whetstone',
  description: 'Sharpens weapons, increases attack',
  effects: [
    {
      type: 'buff',
      value: 12,
      stat: 'attack',
      duration: 4,
      target: 'self',
    }
  ],
  icon: GiStoneWheel,
  baseGoldValue: 22,
  usableInCombat: false,
  usableOutOfCombat: true,
}
