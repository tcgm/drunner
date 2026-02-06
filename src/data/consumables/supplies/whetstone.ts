import { GiStoneWheel } from 'react-icons/gi'
import type { ConsumableBase } from '../bases/types'

// Whetstone - sharpens weapons, increases attack
export const WHETSTONE_BASE: ConsumableBase = {
  id: 'whetstone',
  name: 'Whetstone',
  description: 'Sharpens weapons, increases attack',
  effectType: 'buff',
  icon: GiStoneWheel,
  baseValue: 12,
  baseGoldValue: 22,
  stat: 'attack',
  duration: 4,
  target: 'self',
  usableInCombat: false,
  usableOutOfCombat: true,
}
