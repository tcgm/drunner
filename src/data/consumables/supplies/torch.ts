import { GiTorch } from 'react-icons/gi'
import type { ConsumableBase } from '../bases/types'

// Torch - illuminates and improves luck/awareness
export const TORCH_BASE: ConsumableBase = {
  id: 'torch',
  name: 'Torch',
  description: 'Increases luck',
  effects: [
    {
      type: 'buff',
      value: 5,
      stat: 'luck',
      duration: 4,
      target: 'self',
    }
  ],
  icon: GiTorch,
  baseGoldValue: 15,
  usableInCombat: false,
  usableOutOfCombat: true,
}
