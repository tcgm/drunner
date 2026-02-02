import type { DungeonEvent } from '@/types'
import { GiAnts } from 'react-icons/gi'

export const ACID_ANTS: DungeonEvent = {
  id: 'acid-ants',
  type: 'combat',
  title: 'Acid Ants',
  description: 'A swarm of insects spray corrosive acid!',
  choices: [
    {
      text: 'Crush them',
      outcome: {
        text: 'Acid burns your boots!',
        effects: [
          { type: 'damage', target: 'weakest', value: 8 },
          { type: 'xp', value: 31 },
          { type: 'gold', value: 15 },
        ],
      },
    },
    {
      text: 'Avoid the acid (Speed check)',
      requirements: { stat: 'speed', minValue: 10 },
      outcome: {
        text: 'You sidestep the spray!',
        effects: [
          { type: 'damage', target: 'weakest', value: 4 },
          { type: 'xp', value: 41 },
          { type: 'gold', value: 23 },
        ],
      },
    },
  ],
  depth: 2,
  icon: GiAnts,
}
