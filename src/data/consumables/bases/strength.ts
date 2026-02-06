import { GiStrong } from 'react-icons/gi'
import type { ConsumableBase } from './types'

// Strength buff base
export const STRENGTH_BASE: ConsumableBase = {
  id: 'strength',
  name: 'Strength',
  description: 'Increases attack power',
  effects: [
    {
      type: 'buff',
      value: 10,
      stat: 'attack',
      duration: 3,
      target: 'self',
    }
  ],
  icon: GiStrong,
  baseGoldValue: 25,
  usableInCombat: true,
  usableOutOfCombat: true,
}
