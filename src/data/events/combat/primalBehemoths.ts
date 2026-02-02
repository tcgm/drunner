import type { DungeonEvent } from '@/types'
import { GiBearFace } from 'react-icons/gi'

export const PRIMAL_BEHEMOTHS: DungeonEvent = {
  id: 'primal-behemoths',
  type: 'combat',
  title: 'Primal Behemoths',
  description: 'Ancient beasts of immense size and strength charge forward!',
  choices: [
    {
      text: 'Face them head-on',
      outcome: {
        text: 'Their raw power is overwhelming!',
        effects: [
          { type: 'damage', target: 'strongest', value: 50 },
          { type: 'xp', value: 248 },
          { type: 'gold', value: 170 },
        ],
      },
    },
    {
      text: 'Matched strength (Strength check)',
      requirements: { stat: 'strength', minValue: 95 },
      outcome: {
        text: 'You overpower the beasts!',
        effects: [
          { type: 'damage', target: 'strongest', value: 39 },
          { type: 'xp', value: 268 },
          { type: 'gold', value: 190 },
        ],
      },
    },
  ],
  depth: 38,
  icon: GiBearFace,
}
