import type { DungeonEvent } from '@/types'

export const TRAVELING_MERCHANT: DungeonEvent = {
  id: 'traveling-merchant',
  type: 'merchant',
  title: 'Traveling Merchant',
  description: 'A cheerful merchant has set up shop in the dungeon. His prices are fair.',
  choices: [
    {
      text: 'Buy health potions (costs 50 gold)',
      requirements: {
        item: 'gold',
      },
      outcome: {
        text: 'You purchase potions and use them immediately.',
        effects: [
          { type: 'gold', value: -50 },
          { type: 'heal', target: 'all', value: 60 },
        ],
      },
    },
    {
      text: 'Buy equipment upgrade (costs 100 gold)',
      requirements: {
        item: 'gold',
      },
      outcome: {
        text: 'You purchase better equipment!',
        effects: [
          { type: 'gold', value: -100 },
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
}
