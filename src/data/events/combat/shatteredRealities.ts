import type { DungeonEvent } from '@/types'
import { GiCracked Disc } from 'react-icons/gi'

export const SHATTERED_REALITIES: DungeonEvent = {
  id: 'shattered-realities',
  type: 'combat',
  title: 'Shattered Realities',
  description: 'Fragments of broken timelines attack from the past and future!',
  choices: [
    {
      text: 'Face all timelines',
      outcome: {
        text: 'You are attacked from all directions in time!',
        effects: [
          { type: 'damage', target: 'random', value: 109 },
          { type: 'xp', value: 579 },
          { type: 'gold', value: 445 },
        ],
      },
    },
    {
      text: 'Anchor yourself in the present (Defense check)',
      requirements: { stat: 'defense', minValue: 161 },
      outcome: {
        text: 'You exist only in the now!',
        effects: [
          { type: 'damage', target: 'random', value: 98 },
          { type: 'xp', value: 599 },
          { type: 'gold', value: 465 },
        ],
      },
    },
  ],
  depth: 66,
  icon: GiCrackedDisc,
}
