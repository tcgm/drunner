import type { DungeonEvent } from '@/types'
import { GiNestedHexagons } from 'react-icons/gi'

export const PATTERN_BEASTS: DungeonEvent = {
  id: 'pattern-beasts',
  type: 'combat',
  title: 'Pattern Beasts',
  description: 'Creatures made of impossible geometric patterns!',
  choices: [
    {
      text: 'Look directly at them',
      outcome: {
        text: 'The patterns hurt your mind!',
        effects: [
          { type: 'damage', target: 'random', value: 115 },
          { type: 'xp', value: 610 },
          { type: 'gold', value: 470 },
        ],
      },
    },
    {
      text: 'Fight peripherally (Rogue bonus)',
      requirements: { class: 'Rogue' },
      outcome: {
        text: 'You strike without looking!',
        effects: [
          { type: 'damage', target: 'random', value: 104 },
          { type: 'xp', value: 630 },
          { type: 'gold', value: 490 },
        ],
      },
    },
  ],
  depth: 63,
  icon: GiNestedHexagons,
}
