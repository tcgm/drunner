import type { DungeonEvent } from '@/types'
import { GiShop } from 'react-icons/gi'

export const TRAVELING_MERCHANT: DungeonEvent = {
  id: 'traveling-merchant',
  type: 'merchant',
  title: 'Traveling Merchant',
  description: 'A cheerful merchant has set up shop in the dungeon. His prices are fair.',
  choices: [
    {
      text: 'Buy health potions',
      requirements: {
        gold: 50,
      },
      outcome: {
        text: 'You purchase some healing potions for your journey.',
        effects: [
          { type: 'gold', value: -50 },
          { type: 'consumable', consumableId: 'health-small' },
          { type: 'consumable', consumableId: 'health-small' },
          { type: 'consumable', consumableId: 'health-small' },
        ],
      },
    },
    {
      text: 'Buy equipment upgrade',
      requirements: {
        gold: 100,
      },
      outcome: {
        text: 'The merchant upgrades your equipment using mystical techniques!',
        effects: [
          { type: 'gold', value: -100 },
          { type: 'upgradeItem' },
        ],
      },
    },
    {
      text: 'Sell excess gear',
      outcome: {
        text: 'You sell old equipment for a decent price.',
        effects: [
          { type: 'gold', value: 80 },
        ],
      },
    },
    {
      text: 'Just browse',
      outcome: {
        text: 'You look around but don\'t buy anything.',
        effects: [],
      },
    },
  ],
  depth: 2,
  icon: GiShop,
}
