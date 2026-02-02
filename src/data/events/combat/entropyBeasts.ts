import type { DungeonEvent } from '@/types'
import { GiAbstract048 } from 'react-icons/gi'

export const ENTROPY_BEASTS: DungeonEvent = {
  id: 'entropy-beasts',
  type: 'combat',
  title: 'Entropy Beasts',
  description: 'Creatures that accelerate decay attack with entropy itself!',
  choices: [
    {
      text: 'Fight decay',
      outcome: {
        text: 'Everything ages rapidly!',
        effects: [
          { type: 'damage', target: 'strongest', value: 75 },
          { type: 'xp', value: 370 },
          { type: 'gold', value: 268 },
        ],
      },
    },
    {
      text: 'Temporal resistance (Speed check)',
      requirements: { stat: 'speed', minValue: 130 },
      outcome: {
        text: 'You move faster than entropy!',
        effects: [
          { type: 'damage', target: 'strongest', value: 64 },
          { type: 'xp', value: 390 },
          { type: 'gold', value: 288 },
        ],
      },
    },
  ],
  depth: 54,
  icon: GiAbstract048,
}
