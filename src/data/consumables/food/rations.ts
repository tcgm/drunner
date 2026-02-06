import { GiPaperBagFolded } from 'react-icons/gi'
import type { ConsumableBase } from '../bases/types'

// Rations - preserved food for adventurers, heal over time
export const RATIONS_BASE: ConsumableBase = {
  id: 'rations',
  name: 'Rations',
  description: 'Restores HP over several events',
  effects: [
    {
      type: 'hot',
      value: 15,
      duration: 3,
      target: 'self',
    }
  ],
  icon: GiPaperBagFolded,
  baseGoldValue: 14,
  usableInCombat: true,
  usableOutOfCombat: true,
}
