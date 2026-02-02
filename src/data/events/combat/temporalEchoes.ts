import type { DungeonEvent } from '@/types'
import { GiSundial } from 'react-icons/gi'

export const TEMPORAL_ECHOES: DungeonEvent = {
  id: 'temporal-echoes',
  type: 'combat',
  title: 'Temporal Echoes',
  description: 'Duplicates of past adventurers flicker in and out of time!',
  choices: [
    {
      text: 'Fight all versions',
      outcome: {
        text: 'You battle across timelines!',
        effects: [
          { type: 'damage', target: 'all', value: 18 },
          { type: 'xp', value: 76 },
          { type: 'gold', value: 45 },
        ],
      },
    },
    {
      text: 'Predict movements (Speed check)',
      requirements: { stat: 'speed', minValue: 27 },
      outcome: {
        text: 'You anticipate their actions!',
        effects: [
          { type: 'damage', target: 'all', value: 13 },
          { type: 'xp', value: 91 },
          { type: 'gold', value: 55 },
        ],
      },
    },
  ],
  depth: 11,
  icon: GiSundial,
}
