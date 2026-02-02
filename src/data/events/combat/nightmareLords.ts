import type { DungeonEvent } from '@/types'
import { GiEvilBat } from 'react-icons/gi'

export const NIGHTMARE_LORDS: DungeonEvent = {
  id: 'nightmare-lords',
  type: 'combat',
  title: 'Nightmare Lords',
  description: 'Masters of terror manifest your worst fears into lethal reality!',
  choices: [
    {
      text: 'Confront all fears',
      outcome: {
        text: 'Every terror attacks at once!',
        effects: [
          { type: 'damage', target: 'all', value: 105 },
          { type: 'xp', value: 555 },
          { type: 'gold', value: 435 },
        ],
      },
    },
    {
      text: 'Fearless heart (Defense check)',
      requirements: { stat: 'defense', minValue: 162 },
      outcome: {
        text: 'You have no fear to exploit!',
        effects: [
          { type: 'damage', target: 'all', value: 94 },
          { type: 'xp', value: 575 },
          { type: 'gold', value: 455 },
        ],
      },
    },
  ],
  depth: 71,
  icon: GiEvilBat,
}
