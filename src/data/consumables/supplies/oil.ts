import { GiSquareBottle } from 'react-icons/gi'
import type { ConsumableBase } from '../bases/types'

// Oil - versatile supply for weapon coating (attack buff)
export const OIL_BASE: ConsumableBase = {
  id: 'oil',
  name: 'Oil',
  description: 'Coats weapon, increases attack',
  effectType: 'buff',
  icon: GiSquareBottle,
  baseValue: 10,
  baseGoldValue: 18,
  stat: 'attack',
  duration: 3,
  target: 'self',
  usableInCombat: false,
  usableOutOfCombat: true,
}
