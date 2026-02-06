import { GiCampCookingPot } from 'react-icons/gi'
import type { ConsumableBase } from '../bases/types'

// Stew - hearty meal with immediate and sustained healing
export const STEW_BASE: ConsumableBase = {
  id: 'stew',
  name: 'Stew',
  description: 'Restores HP instantly and over time',
  effects: [
    {
      type: 'heal',
      value: 25,
      target: 'self',
    },
    {
      type: 'hot',
      value: 20,
      duration: 3,
      target: 'self',
    }
  ],
  icon: GiCampCookingPot,
  baseGoldValue: 18,
  usableInCombat: true,
  usableOutOfCombat: true,
}
