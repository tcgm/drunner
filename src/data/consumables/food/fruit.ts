import { GiPear } from 'react-icons/gi'
import type { ConsumableBase } from '../bases/types'

// Fruit - light, refreshing healing
export const FRUIT_BASE: ConsumableBase = {
  id: 'fruit',
  name: 'Fruit',
  description: 'Restores HP',
  effectType: 'heal',
  icon: GiPear,
  baseValue: 35,
  baseGoldValue: 12,
  target: 'self',
  usableInCombat: true,
  usableOutOfCombat: true,
}
