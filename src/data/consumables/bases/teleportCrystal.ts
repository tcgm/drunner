import { GiFloatingCrystal } from 'react-icons/gi'
import type { ConsumableBase } from './types'

// Teleport crystal: jumps the party to a specific floor based on potency
// base value 3 → floor range ~1 (diluted tiny) to ~75 (pure superior)
export const TELEPORT_CRYSTAL_BASE: ConsumableBase = {
  id: 'teleport-crystal',
  name: 'Teleport Crystal',
  description: 'Teleports the party to a specific floor based on potency',
  effects: [
    {
      type: 'teleport',
      value: 3,
    }
  ],
  icon: GiFloatingCrystal,
  baseGoldValue: 50,
  usableInCombat: false,
  usableOutOfCombat: true,
  consumableType: 'crystal',
}
