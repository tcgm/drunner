import { GiClover } from 'react-icons/gi'
import type { ConsumableBase } from './types'

// Luck buff base
export const LUCK_BASE: ConsumableBase = {
  id: 'luck',
  name: 'Luck',
  description: 'Increases luck',
  effects: [
    {
      type: 'buff',
      value: 10,
      stat: 'luck',
      duration: 3,
      target: 'self',
    }
  ],
  icon: GiClover,
  baseGoldValue: 30,
  usableInCombat: true,
  usableOutOfCombat: true,
}
