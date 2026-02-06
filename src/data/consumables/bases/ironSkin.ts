import { GiShield } from 'react-icons/gi'
import type { ConsumableBase } from './types'

// Defense buff base
export const IRON_SKIN_BASE: ConsumableBase = {
  id: 'iron-skin',
  name: 'Iron Skin',
  description: 'Increases defense',
  effects: [
    {
      type: 'buff',
      value: 10,
      stat: 'defense',
      duration: 3,
      target: 'self',
    }
  ],
  icon: GiShield,
  baseGoldValue: 25,
  usableInCombat: true,
  usableOutOfCombat: true,
}
