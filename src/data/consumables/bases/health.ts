import { GiHealthPotion } from 'react-icons/gi'
import type { ConsumableBase } from './types'

// Health restoration base
export const HEALTH_BASE: ConsumableBase = {
  id: 'health',
  name: 'Health',
  description: 'Restores HP',
  effects: [
    {
      type: 'heal',
      value: 200,
      target: 'self',
    }
  ],
  icon: GiHealthPotion,
  baseGoldValue: 15,
  usableInCombat: true,
  usableOutOfCombat: true,
}
