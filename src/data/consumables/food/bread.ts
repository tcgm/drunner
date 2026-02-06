import { GiBread } from 'react-icons/gi'
import type { ConsumableBase } from '../bases/types'

// Bread - basic health restoration
export const BREAD_BASE: ConsumableBase = {
  id: 'bread',
  name: 'Bread',
  description: 'Restores HP',
  effectType: 'heal',
  icon: GiBread,
  baseValue: 40,
  baseGoldValue: 10,
  target: 'self',
  usableInCombat: true,
  usableOutOfCombat: true,
}
