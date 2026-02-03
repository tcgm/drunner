import type { Consumable } from '../../../types'
import { GiClover } from 'react-icons/gi'

export const LUCK_ELIXIR: Consumable = {
  id: 'luck-elixir',
  name: 'Luck Elixir',
  description: 'Increases luck by 15 for 5 events.',
  type: 'consumable',
  rarity: 'rare',
  stats: {},
  value: 100,
  icon: GiClover,
  consumableType: 'potion',
  effect: {
    type: 'buff',
    stat: 'luck',
    value: 15,
    duration: 5,
    target: 'self',
  },
  usableInCombat: false,
  usableOutOfCombat: true,
  stackable: true,
  stackCount: 1,
}
