import { GiBandageRoll } from 'react-icons/gi'
import type { ConsumableBase } from '../bases/types'

// Bandages - proper wound care, heals over time
export const BANDAGES_BASE: ConsumableBase = {
  id: 'bandages',
  name: 'Bandages',
  description: 'Restores HP over several events',
  effects: [
    {
      type: 'hot',
      value: 12,
      duration: 3,
      target: 'self',
    }
  ],
  icon: GiBandageRoll,
  baseGoldValue: 12,
  usableInCombat: true,
  usableOutOfCombat: true,
}
