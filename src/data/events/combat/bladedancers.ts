import type { DungeonEvent } from '@/types'
import { GiSwordman } from 'react-icons/gi'

export const BLADEDANCERS: DungeonEvent = {
  id: 'bladedancers',
  type: 'combat',
  title: 'Bladedancers',
  description: 'Graceful warriors perform a deadly dance with razor-sharp blades!',
  choices: [
    {
      text: 'Match their footwork',
      outcome: {
        text: 'Their dance is mesmerizing and lethal!',
        effects: [
          { type: 'damage', target: 'random', value: 57 },
          { type: 'xp', value: 270 },
          { type: 'gold', value: 200 },
        ],
      },
    },
    {
      text: 'Disrupt the dance (Rogue bonus)',
      requirements: { class: 'Rogue' },
      outcome: {
        text: 'You break their rhythm!',
        effects: [
          { type: 'damage', target: 'random', value: 46 },
          { type: 'xp', value: 290 },
          { type: 'gold', value: 215 },
        ],
      },
    },
  ],
  depth: 42,
  icon: GiSwordman,
}
