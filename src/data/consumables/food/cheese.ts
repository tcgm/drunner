import { GiCheeseWedge } from 'react-icons/gi'
import type { ConsumableBase } from '../bases/types'

// Cheese - charisma buff from comfort food, boosts morale
export const CHEESE_BASE: ConsumableBase = {
  id: 'cheese',
  name: 'Cheese',
  description: 'Boosts morale and charisma',
  effects: [
    {
      type: 'buff',
      value: 8,
      stat: 'charisma',
      duration: 3,
      target: 'self',
    }
  ],
  icon: GiCheeseWedge,
  baseGoldValue: 20,
  usableInCombat: true,
  usableOutOfCombat: true,
}
