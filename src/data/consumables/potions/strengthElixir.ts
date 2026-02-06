import type { Consumable } from '../../../types'
import { GiStrong } from 'react-icons/gi'

export const STRENGTH_ELIXIR: Consumable = {
  id: 'strength-elixir',
  name: 'Strength Elixir',
  description: 'Increases attack by 10 for 5 events.',
  type: 'consumable',
  rarity: 'uncommon',
  stats: {},
  value: 75,
  icon: GiStrong,
  consumableType: 'potion',
  effects: [
    {
      type: 'buff',
      stat: 'attack',
      value: 10,
      duration: 5,
      target: 'self',
    }
  ],
  usableInCombat: false,
  usableOutOfCombat: true,
  stackable: true,
  stackCount: 1,
}
