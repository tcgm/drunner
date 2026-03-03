import type { Consumable } from '../../../types'
import { GiHealthPotion } from 'react-icons/gi'

export const HEALTH_POTION_LARGE: Consumable = {
  id: 'health-potion-large',
  name: 'Large Health Potion',
  description: 'Restores 400 HP to a single hero.',
  type: 'consumable',
  rarity: 'rare',
  stats: {},
  value: 100,
  icon: GiHealthPotion,
  consumableType: 'potion',
  effects: [
    {
      type: 'heal',
      value: 400,
      target: 'self',
    }
  ],
  usableInCombat: true,
  usableOutOfCombat: true,
  stackable: true,
  stackCount: 1,
}
