import { GiDungeonGate } from 'react-icons/gi'
import type { Building } from './types'

export const dungeonEntrance: Building = {
  id: 'dungeon-entrance',
  icon: GiDungeonGate,
  label: 'Dungeon Entrance',
  color: '#FB923C',
  description: 'Enter the dungeon',
  disabled: false,
  sizeMultiplier: 1.5,
  labelSize: 'lg',
}
