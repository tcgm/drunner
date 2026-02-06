import { GiMeat } from 'react-icons/gi'
import type { ConsumableBase } from '../bases/types'

// Dried/Cooked Meat - attack buff from sustaining protein
export const MEAT_BASE: ConsumableBase = {
  id: 'meat',
  name: 'Meat',
  description: 'Increases attack power',
  effects: [
    {
      type: 'buff',
      value: 8,
      stat: 'attack',
      duration: 3,
      target: 'self',
    }
  ],
  icon: GiMeat,
  baseGoldValue: 20,
  usableInCombat: true,
  usableOutOfCombat: true,
}
