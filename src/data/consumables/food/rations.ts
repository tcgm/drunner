import { GiPaperBagFolded } from 'react-icons/gi'
import type { ConsumableBase } from '../bases/types'

// Rations - preserved food for adventurers, moderate healing
export const RATIONS_BASE: ConsumableBase = {
  id: 'rations',
  name: 'Rations',
  description: 'Restores HP',
  effectType: 'heal',
  icon: GiPaperBagFolded,
  baseValue: 45,
  baseGoldValue: 14,
  target: 'self',
  usableInCombat: true,
  usableOutOfCombat: true,
}
