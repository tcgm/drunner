import { GiStrong } from 'react-icons/gi'
import type { ConsumableBase } from './types'

// Strength buff base
export const STRENGTH_BASE: ConsumableBase = {
  id: 'strength',
  name: 'Strength',
  description: 'Increases attack power',
  effectType: 'buff',
  icon: GiStrong,
  baseValue: 10,
  baseGoldValue: 25,
  stat: 'attack',
  duration: 3,
  target: 'self',
  usableInCombat: true,
  usableOutOfCombat: true,
}
