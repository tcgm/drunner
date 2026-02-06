import { GiArmorUpgrade } from 'react-icons/gi'
import type { ConsumableBase } from '../bases/types'

// Armor Polish - maintains armor, increases defense
export const ARMOR_POLISH_BASE: ConsumableBase = {
  id: 'armor-polish',
  name: 'Armor Polish',
  description: 'Maintains armor, increases defense',
  effects: [
    {
      type: 'buff',
      value: 12,
      stat: 'defense',
      duration: 4,
      target: 'self',
    }
  ],
  icon: GiArmorUpgrade,
  baseGoldValue: 22,
  usableInCombat: false,
  usableOutOfCombat: true,
}
