import { GiRun } from 'react-icons/gi'
import type { ConsumableBase } from './types'

// Speed buff base
export const HASTE_BASE: ConsumableBase = {
  id: 'haste',
  name: 'Haste',
  description: 'Increases speed',
  effects: [
    {
      type: 'buff',
      value: 10,
      stat: 'speed',
      duration: 3,
      target: 'self',
    }
  ],
  icon: GiRun,
  baseGoldValue: 25,
  usableInCombat: true,
  usableOutOfCombat: true,
}
