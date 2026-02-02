import { Consumable } from '../../../types'
import { GiHealthPotion } from 'react-icons/gi'

export const HEALTH_POTION_MEDIUM: Consumable = {
  id: 'health-potion-medium',
  name: 'Medium Health Potion',
  description: 'Restores 60 HP to a single hero.',
  type: 'accessory1',
  rarity: 'uncommon',
  stats: {},
  value: 50,
  icon: GiHealthPotion,
  consumableType: 'potion',
  effect: {
    type: 'heal',
    value: 60,
    target: 'self',
  },
  usableInCombat: true,
  usableOutOfCombat: true,
  stackable: true,
  stackCount: 1,
}
