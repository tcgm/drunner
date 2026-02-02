import type { DungeonEvent } from '@/types'
import { GiSpikesHalf } from 'react-icons/gi'

export const NEEDLE_BEASTS: DungeonEvent = {
  id: 'needle-beasts',
  type: 'combat',
  title: 'Needle Beasts',
  description: 'Creatures covered in thousands of stabbing needles!',
  choices: [
    {
      text: 'Attack carefully',
      outcome: {
        text: 'Needles pierce from all angles!',
        effects: [
          { type: 'damage', target: 'all', value: 42 },
          { type: 'xp', value: 228 },
          { type: 'gold', value: 153 },
        ],
      },
    },
    {
      text: 'Quick strikes (Speed check)',
      requirements: { stat: 'speed', minValue: 88 },
      outcome: {
        text: 'You avoid the needles!',
        effects: [
          { type: 'damage', target: 'all', value: 31 },
          { type: 'xp', value: 248 },
          { type: 'gold', value: 173 },
        ],
      },
    },
  ],
  depth: 33,
  icon: GiSpikesHalf,
}
