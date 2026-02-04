import { LiaGripfire } from 'react-icons/lia'
import type { ConsumableBase } from './types'

// Resurrection - high rarity only
export const PHOENIX_DOWN_BASE: ConsumableBase = {
  id: 'phoenix-down',
  name: 'Phoenix Down',
  description: 'Resurrects a fallen hero',
  effectType: 'revive',
  icon: LiaGripfire,
  baseValue: 30, // Base HP restored on revive
  baseGoldValue: 100,
  target: 'ally',
  usableInCombat: true,
  usableOutOfCombat: true,
}
