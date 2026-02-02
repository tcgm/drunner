import type { DungeonEvent } from '@/types'
import { GiBookshelf } from 'react-icons/gi'

export const ANCIENT_LIBRARY: DungeonEvent = {
  id: 'ancient-library',
  type: 'choice',
  title: 'Ancient Library',
  description: 'Dusty tomes line the shelves of this forgotten library. Their knowledge could be invaluable... if you can decipher them.',
  choices: [
    {
      text: 'Study the arcane texts (Wisdom check)',
      requirements: { stat: 'wisdom', minValue: 25 },
      outcome: {
        text: 'Your wisdom unlocks the ancient knowledge! You learn powerful secrets.',
        effects: [
          { type: 'xp', value: 200 },
          { type: 'item', itemType: 'random', minRarity: 'rare', rarityBoost: 20 },
        ],
      },
    },
    {
      text: 'Read without understanding',
      outcome: {
        text: 'The words make no sense. A protective curse activates!',
        effects: [
          { type: 'damage', target: 'all', value: 35 },
          { type: 'xp', value: 30 },
        ],
      },
    },
    {
      text: 'Search for valuable books to sell',
      outcome: {
        text: 'You find some intact tomes worth good gold.',
        effects: [
          { type: 'gold', value: 120 },
          { type: 'xp', value: 60 },
        ],
      },
    },
    {
      text: 'Leave the library undisturbed',
      outcome: {
        text: 'You respectfully avoid disturbing the ancient knowledge.',
        effects: [],
      },
    },
  ],
  depth: 20,
  icon: GiBookshelf,
}
