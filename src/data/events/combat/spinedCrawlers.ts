import type { DungeonEvent } from '@/types'
import { GiSpikedTail } from 'react-icons/gi'

export const SPINED_CRAWLERS: DungeonEvent = {
  id: 'spined-crawlers',
  type: 'combat',
  title: 'Spined Crawlers',
  description: 'Creatures covered in sharp quills scuttle toward you!',
  choices: [
    {
      text: 'Attack carefully',
      outcome: {
        text: 'The spines cut you as you fight!',
        effects: [
          { type: 'damage', target: 'strongest', value: 13 },
          { type: 'xp', value: 41 },
          { type: 'gold', value: 21 },
        ],
      },
    },
    {
      text: 'Use reach weapon (Strength check)',
      requirements: { stat: 'strength', minValue: 15 },
      outcome: {
        text: 'You keep them at distance!',
        effects: [
          { type: 'damage', target: 'strongest', value: 8 },
          { type: 'xp', value: 51 },
          { type: 'gold', value: 29 },
        ],
      },
    },
  ],
  depth: 7,
  icon: GiSpikedTail,
}
