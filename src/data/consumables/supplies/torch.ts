import { GiTorch } from 'react-icons/gi'
import type { ConsumableBase } from '../bases/types'

// Torch - illuminates and improves luck/awareness
export const TORCH_BASE: ConsumableBase = {
  id: 'torch',
  name: 'Torch',
  description: 'Increases luck',
  effectType: 'buff',
  icon: GiTorch,
  baseValue: 5,
  baseGoldValue: 15,
  stat: 'luck',
  duration: 4,
  target: 'self',
  usableInCombat: false,
  usableOutOfCombat: true,
}
