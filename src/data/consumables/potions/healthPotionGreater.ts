import type { Consumable } from '../../../types'
import { GiHealthPotion } from 'react-icons/gi'

export const HEALTH_POTION_GREATER: Consumable = {
  id: 'health-potion-greater',
  name: 'Greater Health Potion',
  description: 'Restores 200 HP to a single hero.',
  type: 'consumable',
  rarity: 'epic',
  stats: {},
  value: 200,
  icon: GiHealthPotion,
  consumableType: 'potion',
  effect: {
    type: 'heal',
    value: 200,
    target: 'self',
  },
  usableInCombat: true,
  usableOutOfCombat: true,
  stackable: true,
  stackCount: 1,
}
