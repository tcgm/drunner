import { GiBandageRoll } from 'react-icons/gi'
import type { ConsumableBase } from '../bases/types'

// Bandages - basic healing supply
export const BANDAGES_BASE: ConsumableBase = {
  id: 'bandages',
  name: 'Bandages',
  description: 'Restores HP',
  effectType: 'heal',
  icon: GiBandageRoll,
  baseValue: 35,
  baseGoldValue: 12,
  target: 'self',
  usableInCombat: true,
  usableOutOfCombat: true,
}
