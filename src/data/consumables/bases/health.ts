import { GiHealthPotion } from 'react-icons/gi'
import type { ConsumableBase } from './types'

// Health restoration base
export const HEALTH_BASE: ConsumableBase = {
  id: 'health',
  name: 'Health',
  description: 'Restores HP',
  effectType: 'heal',
  icon: GiHealthPotion,
  baseValue: 50,
  baseGoldValue: 15,
  target: 'self',
  usableInCombat: true,
  usableOutOfCombat: true,
}
