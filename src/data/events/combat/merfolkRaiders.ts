import type { DungeonEvent } from '@/types'
import { GiSpearfishing } from 'react-icons/gi'

export const MERFOLK_RAIDERS: DungeonEvent = {
  id: 'merfolk-raiders',
  type: 'combat',
  title: 'Merfolk Raiders',
  description: 'Aquatic warriors emerge from flooded passages with tridents!',
  choices: [
    {
      text: 'Fight on wet ground',
      outcome: {
        text: 'They have the advantage in water!',
        effects: [
          { type: 'damage', target: 'random', value: 29 },
          { type: 'xp', value: 121 },
          { type: 'gold', value: 75 },
        ],
      },
    },
    {
      text: 'Draw them out (Speed check)',
      requirements: { stat: 'speed', minValue: 47 },
      outcome: {
        text: 'You fight on dry land!',
        effects: [
          { type: 'damage', target: 'random', value: 21 },
          { type: 'xp', value: 141 },
          { type: 'gold', value: 90 },
        ],
      },
    },
  ],
  depth: 20,
  icon: GiSpearfishing,
}
