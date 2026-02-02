import type { DungeonEvent } from '@/types'
import { GiFlamingArrow } from 'react-icons/gi'

export const HELLFIRE_ARCHERS: DungeonEvent = {
  id: 'hellfire-archers',
  type: 'combat',
  title: 'Hellfire Archers',
  description: 'Demonic marksmen fire arrows of infernal flame!',
  choices: [
    {
      text: 'Charge them',
      outcome: {
        text: 'Burning arrows rain down!',
        effects: [
          { type: 'damage', target: 'weakest', value: 58 },
          { type: 'xp', value: 280 },
          { type: 'gold', value: 202 },
        ],
      },
    },
    {
      text: 'Quick approach (Speed check)',
      requirements: { stat: 'speed', minValue: 105 },
      outcome: {
        text: 'You close the distance!',
        effects: [
          { type: 'damage', target: 'weakest', value: 47 },
          { type: 'xp', value: 300 },
          { type: 'gold', value: 218 },
        ],
      },
    },
  ],
  depth: 43,
  icon: GiFlamingArrow,
}
