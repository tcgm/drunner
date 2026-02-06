import { GiFloatingCrystal } from 'react-icons/gi'
import type { ConsumableBase } from '../bases/types'

// Mana Stone - crystallized magic energy, increases magic power
export const MANA_STONE_BASE: ConsumableBase = {
  id: 'mana-stone',
  name: 'Mana Stone',
  description: 'Crystallized magic energy, increases magic power',
  effects: [
    {
      type: 'buff',
      value: 10,
      stat: 'magicPower',
      duration: 3,
      target: 'self',
    }
  ],
  icon: GiFloatingCrystal,
  baseGoldValue: 25,
  usableInCombat: false,
  usableOutOfCombat: true,
}
