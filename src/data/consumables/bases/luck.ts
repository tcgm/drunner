import { GiClover } from 'react-icons/gi'
import type { ConsumableBase } from './types'

// Luck buff base
export const LUCK_BASE: ConsumableBase = {
  id: 'luck',
  name: 'Luck',
  description: 'Increases luck',
  effectType: 'buff',
  icon: GiClover,
  baseValue: 10,
  baseGoldValue: 30,
  stat: 'luck',
  duration: 3,
  target: 'self',
  usableInCombat: true,
  usableOutOfCombat: true,
}
