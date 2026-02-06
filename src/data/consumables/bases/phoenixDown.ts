import { LiaGripfire } from 'react-icons/lia'
import type { ConsumableBase } from './types'

// Resurrection - high rarity only
export const PHOENIX_DOWN_BASE: ConsumableBase = {
  id: 'phoenix-down',
  name: 'Phoenix Down',
  description: 'Resurrects a fallen hero',
  effects: [
    {
      type: 'revive',
      value: 30,
      target: 'ally',
    }
  ],
  icon: LiaGripfire,
  baseGoldValue: 100,
  usableInCombat: true,
  usableOutOfCombat: true,
}
