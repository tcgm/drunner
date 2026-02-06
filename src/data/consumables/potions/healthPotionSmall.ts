import type { Consumable } from '../../../types'
import { GiHealthPotion } from 'react-icons/gi'

export const HEALTH_POTION_SMALL: Consumable = {
  id: 'health-potion-small',
  name: 'Small Health Potion',
  description: 'Restores 30 HP to a single hero.',
  type: 'consumable',
  rarity: 'common',
  stats: {},
  value: 25,
  icon: GiHealthPotion,
  consumableType: 'potion',
  effects: [
    {
      type: 'heal',
      value: 30,
      target: 'self',
    }
  ],
  usableInCombat: true,
  usableOutOfCombat: true,
  stackable: true,
  stackCount: 1,
}
