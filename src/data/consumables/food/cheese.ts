import { GiCheeseWedge } from 'react-icons/gi'
import type { ConsumableBase } from '../bases/types'

// Cheese - defense buff from hardy, fortifying food
export const CHEESE_BASE: ConsumableBase = {
  id: 'cheese',
  name: 'Cheese',
  description: 'Increases defense',
  effectType: 'buff',
  icon: GiCheeseWedge,
  baseValue: 8,
  baseGoldValue: 20,
  stat: 'defense',
  duration: 3,
  target: 'self',
  usableInCombat: true,
  usableOutOfCombat: true,
}
