import type { DungeonEvent } from '@/types'
import { GiAbstract098 } from 'react-icons/gi'

export const CHRONO_HUNTERS: DungeonEvent = {
  id: 'chrono-hunters',
  type: 'combat',
  title: 'Chrono Hunters',
  description: 'Time-manipulating predators attack from past and future simultaneously!',
  choices: [
    {
      text: 'Fight across time',
      outcome: {
        text: 'They strike before you move!',
        effects: [
          { type: 'damage', target: 'random', value: 80 },
          { type: 'xp', value: 395 },
          { type: 'gold', value: 285 },
        ],
      },
    },
    {
      text: 'Temporal reflexes (Speed check)',
      requirements: { stat: 'speed', minValue: 135 },
      outcome: {
        text: 'You anticipate their attacks!',
        effects: [
          { type: 'damage', target: 'random', value: 69 },
          { type: 'xp', value: 415 },
          { type: 'gold', value: 300 },
        ],
      },
    },
  ],
  depth: 58,
  icon: GiAbstract098,
}
