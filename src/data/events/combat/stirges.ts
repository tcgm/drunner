import type { DungeonEvent } from '@/types'
import { GiMosquito } from 'react-icons/gi'

export const STIRGES: DungeonEvent = {
  id: 'stirges',
  type: 'combat',
  title: 'Stirges',
  description: 'Blood-drinking flying creatures dive at you with needle-like proboscises!',
  choices: [
    {
      text: 'Swat them away',
      outcome: {
        text: 'You fend off the bloodsuckers!',
        effects: [
          { type: 'damage', target: 'weakest', value: 10 },
          { type: 'xp', value: 36 },
          { type: 'gold', value: 17 },
        ],
      },
    },
    {
      text: 'Quick strikes (Speed check)',
      requirements: { stat: 'speed', minValue: 12 },
      outcome: {
        text: 'You catch them mid-flight!',
        effects: [
          { type: 'damage', target: 'weakest', value: 6 },
          { type: 'xp', value: 46 },
          { type: 'gold', value: 25 },
        ],
      },
    },
  ],
  depth: 8,
  icon: GiMosquito,
}
