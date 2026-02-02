import type { DungeonEvent } from '@/types'
import { GiPsychicWaves } from 'react-icons/gi'

export const MIND_FLAYERS: DungeonEvent = {
  id: 'mind-flayers',
  type: 'combat',
  title: 'Mind Flayers',
  description: 'Psychic predators assault your thoughts and memories!',
  choices: [
    {
      text: 'Mental resistance',
      outcome: {
        text: 'They tear through your mind!',
        effects: [
          { type: 'damage', target: 'weakest', value: 95 },
          { type: 'xp', value: 485 },
          { type: 'gold', value: 365 },
        ],
      },
    },
    {
      text: 'Mental fortress (Defense check)',
      requirements: { stat: 'defense', minValue: 145 },
      outcome: {
        text: 'Your mind remains secure!',
        effects: [
          { type: 'damage', target: 'weakest', value: 84 },
          { type: 'xp', value: 505 },
          { type: 'gold', value: 385 },
        ],
      },
    },
  ],
  depth: 67,
  icon: GiPsychicWaves,
}
