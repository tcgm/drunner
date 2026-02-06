import { GiMeat } from 'react-icons/gi'
import type { ConsumableBase } from '../bases/types'

// Dried/Cooked Meat - attack buff from sustaining protein
export const MEAT_BASE: ConsumableBase = {
  id: 'meat',
  name: 'Meat',
  description: 'Increases attack power',
  effectType: 'buff',
  icon: GiMeat,
  baseValue: 8,
  baseGoldValue: 20,
  stat: 'attack',
  duration: 3,
  target: 'self',
  usableInCombat: true,
  usableOutOfCombat: true,
}
