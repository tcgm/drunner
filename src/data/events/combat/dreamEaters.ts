import type { DungeonEvent } from '@/types'
import { GiNightSleep } from 'react-icons/gi'

export const DREAM_EATERS: DungeonEvent = {
  id: 'dream-eaters',
  type: 'combat',
  title: 'Dream Eaters',
  description: 'Ethereal beings that feed on dreams and sleep!',
  choices: [
    {
      text: 'Stay awake and fight',
      outcome: {
        text: 'They drain your consciousness!',
        effects: [
          { type: 'damage', target: 'random', value: 46 },
          { type: 'xp', value: 236 },
          { type: 'gold', value: 161 },
        ],
      },
    },
    {
      text: 'Mental barriers (Defense check)',
      requirements: { stat: 'defense', minValue: 78 },
      outcome: {
        text: 'Your mind remains alert!',
        effects: [
          { type: 'damage', target: 'random', value: 35 },
          { type: 'xp', value: 256 },
          { type: 'gold', value: 181 },
        ],
      },
    },
  ],
  depth: 36,
  icon: GiNightSleep,
}
