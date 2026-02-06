import { GiCampCookingPot } from 'react-icons/gi'
import type { ConsumableBase } from '../bases/types'

// Stew - hearty, substantial healing
export const STEW_BASE: ConsumableBase = {
  id: 'stew',
  name: 'Stew',
  description: 'Restores HP substantially',
  effectType: 'heal',
  icon: GiCampCookingPot,
  baseValue: 60,
  baseGoldValue: 18,
  target: 'self',
  usableInCombat: true,
  usableOutOfCombat: true,
}
