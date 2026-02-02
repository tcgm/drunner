import type { DungeonEvent } from '@/types'
import { GiCrystalBall } from 'react-icons/gi'

export const MYSTICAL_VISION: DungeonEvent = {
  id: 'mystical-vision',
  type: 'choice',
  title: 'Mystical Vision',
  description: 'A shimmering portal reveals glimpses of possible futures. You sense ancient knowledge within.',
  choices: [
    {
      text: 'Meditate and interpret the visions (Wisdom check)',
      requirements: { stat: 'wisdom', minValue: 20 },
      outcome: {
        text: 'Your wisdom allows you to understand the visions! You gain insight into upcoming dangers.',
        effects: [
          { type: 'xp', value: 150 },
          { type: 'gold', value: 100 },
          { type: 'item', itemType: 'random', minRarity: 'rare', rarityBoost: 10 },
        ],
      },
    },
    {
      text: 'Try to interpret without preparation',
      outcome: {
        text: 'The visions overwhelm your mind! You stumble back, confused.',
        effects: [
          { type: 'damage', target: 'random', value: 25 },
          { type: 'xp', value: 50 },
        ],
      },
    },
    {
      text: 'Draw power from the portal',
      outcome: {
        text: 'Raw magical energy surges through you!',
        effects: [
          { type: 'heal', target: 'all', value: 30 },
          { type: 'damage', target: 'all', value: 20 },
          { type: 'xp', value: 80 },
        ],
      },
    },
    {
      text: 'Ignore the vision and move on',
      outcome: {
        text: 'You wisely avoid the mysterious portal.',
        effects: [],
      },
    },
  ],
  depth: 15,
  icon: GiCrystalBall,
}
