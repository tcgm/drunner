import { GiArmorUpgrade } from 'react-icons/gi'
import type { ConsumableBase } from '../bases/types'

// Armor Polish - maintains armor, increases defense
export const ARMOR_POLISH_BASE: ConsumableBase = {
  id: 'armor-polish',
  name: 'Armor Polish',
  description: 'Maintains armor, increases defense',
  effectType: 'buff',
  icon: GiArmorUpgrade,
  baseValue: 12,
  baseGoldValue: 22,
  stat: 'defense',
  duration: 4,
  target: 'self',
  usableInCombat: false,
  usableOutOfCombat: true,
}
