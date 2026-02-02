import type { DungeonEvent } from '@/types'
import { GiTimeLoop } from 'react-icons/gi'

export const TIME_PREDATORS: DungeonEvent = {
  id: 'time-predators',
  type: 'combat',
  title: 'Time Predators',
  description: 'Hunters that stalk through temporal streams attack from past and future!',
  choices: [
    {
      text: 'Fight across timelines',
      outcome: {
        text: 'They kill you before you react!',
        effects: [
          { type: 'damage', target: 'strongest', value: 114 },
          { type: 'xp', value: 595 },
          { type: 'gold', value: 475 },
        ],
      },
    },
    {
      text: 'Temporal awareness (Speed check)',
      requirements: { stat: 'speed', minValue: 180 },
      outcome: {
        text: 'You perceive all timelines!',
        effects: [
          { type: 'damage', target: 'strongest', value: 103 },
          { type: 'xp', value: 615 },
          { type: 'gold', value: 495 },
        ],
      },
    },
  ],
  depth: 76,
  icon: GiTimeLoop,
}
