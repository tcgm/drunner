import { GiRun } from 'react-icons/gi'
import type { ConsumableBase } from './types'

// Speed buff base
export const HASTE_BASE: ConsumableBase = {
  id: 'haste',
  name: 'Haste',
  description: 'Increases speed',
  effectType: 'buff',
  icon: GiRun,
  baseValue: 10,
  baseGoldValue: 25,
  stat: 'speed',
  duration: 3,
  target: 'self',
  usableInCombat: true,
  usableOutOfCombat: true,
}
