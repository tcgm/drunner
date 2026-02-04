import { GiShield } from 'react-icons/gi'
import type { ConsumableBase } from './types'

// Defense buff base
export const IRON_SKIN_BASE: ConsumableBase = {
  id: 'iron-skin',
  name: 'Iron Skin',
  description: 'Increases defense',
  effectType: 'buff',
  icon: GiShield,
  baseValue: 10,
  baseGoldValue: 25,
  stat: 'defense',
  duration: 3,
  target: 'self',
  usableInCombat: true,
  usableOutOfCombat: true,
}
