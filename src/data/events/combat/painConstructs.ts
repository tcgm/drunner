import type { DungeonEvent } from '@/types'
import { GiSpikesInit } from 'react-icons/gi'

export const PAIN_CONSTRUCTS: DungeonEvent = {
  id: 'pain-constructs',
  type: 'combat',
  title: 'Pain Constructs',
  description: 'Living torture devices seek to inflict maximum agony!',
  choices: [
    {
      text: 'Endure the pain',
      outcome: {
        text: 'Agony racks your body!',
        effects: [
          { type: 'damage', target: 'weakest', value: 64 },
          { type: 'xp', value: 297 },
          { type: 'gold', value: 215 },
        ],
      },
    },
    {
      text: 'Mind over matter (Defense check)',
      requirements: { stat: 'defense', minValue: 100 },
      outcome: {
        text: 'You block out the pain!',
        effects: [
          { type: 'damage', target: 'weakest', value: 53 },
          { type: 'xp', value: 317 },
          { type: 'gold', value: 220 },
        ],
      },
    },
  ],
  depth: 46,
  icon: GiSpikesInit,
}
