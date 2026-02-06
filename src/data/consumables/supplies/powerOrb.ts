import { GiConcentrationOrb } from 'react-icons/gi'
import type { ConsumableBase } from '../bases/types'

// Power Orb - concentrated arcane power, increases magic power
export const POWER_ORB_BASE: ConsumableBase = {
  id: 'power-orb',
  name: 'Power Orb',
  description: 'Concentrated arcane power, increases magic power',
  effects: [
    {
      type: 'buff',
      value: 15,
      stat: 'magicPower',
      duration: 4,
      target: 'self',
    }
  ],
  icon: GiConcentrationOrb,
  baseGoldValue: 35,
  usableInCombat: false,
  usableOutOfCombat: true,
}
