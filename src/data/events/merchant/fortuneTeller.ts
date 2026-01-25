import type { DungeonEvent } from '@/types'

export const FORTUNE_TELLER: DungeonEvent = {
  id: 'fortune-teller',
  type: 'merchant',
  title: 'Mystic Fortune Teller',
  description: 'A fortune teller offers to reveal your future... for a price.',
  choices: [
    {
      text: 'Pay for fortune (costs 75 gold)',
      requirements: {
        item: 'gold',
      },
      outcome: {
        text: 'She reveals secrets of the dungeon ahead!',
        effects: [
          { type: 'gold', value: -75 },
          { type: 'xp', value: 90 },
        ],
      },
    },
    {
      text: 'Bargain for discount',
      outcome: {
        text: 'She agrees to a reduced price for her services.',
        effects: [
          { type: 'gold', value: -40 },
          { type: 'xp', value: 50 },
        ],
      },
    },
    {
      text: 'Ask for blessing instead',
      outcome: {
        text: 'She blesses your journey and heals you.',
        effects: [
          { type: 'gold', value: -30 },
          { type: 'heal', target: 'all', value: 50 },
        ],
      },
    },
    {
      text: 'Walk away',
      outcome: {
        text: 'You don\'t believe in fortunes.',
        effects: [],
      },
    },
  ],
  depth: 3,
}
