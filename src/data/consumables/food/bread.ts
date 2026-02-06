import { GiBread } from 'react-icons/gi'
import type { ConsumableBase } from '../bases/types'

// Bread - basic health restoration
export const BREAD_BASE: ConsumableBase = {
  id: 'bread',
  name: 'Bread',
  description: 'Restores HP',
  effects: [
    {
      type: 'heal',
      value: 40,
      target: 'self',
    }
  ],
  icon: GiBread,
  baseGoldValue: 10,
  usableInCombat: true,
  usableOutOfCombat: true,
}
